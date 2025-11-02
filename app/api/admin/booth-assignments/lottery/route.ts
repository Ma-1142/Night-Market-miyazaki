import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// POST: Automatic lottery assignment for approved forms without booth assignments
export async function POST() {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Find approved forms without booth assignments
    const approvedForms = await prisma.form.findMany({
      where: {
        status: "approved",
        NOT: {
          id: {
            in: (await prisma.boothAssignment.findMany({
              select: { formId: true }
            })).map(assignment => assignment.formId)
          }
        }
      }
    });

    if (approvedForms.length === 0) {
      return NextResponse.json({
        message: "No approved forms without booth assignments found",
        assignedCount: 0
      });
    }

    // Generate booth IDs A01-D40 (160 booths total)
    const sections = ['A', 'B', 'C', 'D'];
    const allBoothIds: string[] = [];

    for (const section of sections) {
      for (let i = 1; i <= 40; i++) {
        const boothId = `${section}${i.toString().padStart(2, '0')}`;
        allBoothIds.push(boothId);
      }
    }

    // Get already assigned booth IDs
    const existingAssignments = await prisma.boothAssignment.findMany({
      select: { boothId: true }
    });
    const assignedBoothIds = new Set(existingAssignments.map(a => a.boothId));

    // Filter out already assigned booths
    const availableBoothIds = allBoothIds.filter(id => !assignedBoothIds.has(id));

    if (availableBoothIds.length < approvedForms.length) {
      return NextResponse.json(
        {
          error: "Not enough available booths",
          available: availableBoothIds.length,
          needed: approvedForms.length
        },
        { status: 400 }
      );
    }

    // Shuffle available booth IDs using Fisher-Yates algorithm
    const shuffledBoothIds = [...availableBoothIds];
    for (let i = shuffledBoothIds.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledBoothIds[i], shuffledBoothIds[j]] = [shuffledBoothIds[j], shuffledBoothIds[i]];
    }

    // Create booth assignments
    const assignments = approvedForms.map((form, index) => ({
      formId: form.id,
      boothId: shuffledBoothIds[index]
    }));

    await prisma.boothAssignment.createMany({
      data: assignments
    });

    return NextResponse.json({
      message: "Lottery assignment completed successfully",
      assignedCount: assignments.length
    });

  } catch (error) {
    console.error("Error performing lottery assignment:", error);
    return NextResponse.json(
      { error: "Failed to perform lottery assignment" },
      { status: 500 }
    );
  }
}
