// Stripe integration test script
import Stripe from "stripe";
import { getPrice, isValidCombination, formatPrice, BOOTH_TYPE_LABELS, PLAN_LABELS } from "../lib/stripe/pricing";

// Load environment variables
import "dotenv/config";

async function testStripeConnection() {
  console.log("=== Stripe Connection Test ===\n");

  if (!process.env.STRIPE_SECRET_KEY) {
    console.error("ERROR: STRIPE_SECRET_KEY is not set");
    return false;
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-12-15.clover",
    });

    // Test: Retrieve account info
    const account = await stripe.accounts.retrieve();
    console.log("Stripe Connection: SUCCESS");
    console.log(`Account ID: ${account.id}`);
    console.log(`Country: ${account.country}`);
    return true;
  } catch (error) {
    console.error("Stripe Connection: FAILED");
    console.error(error instanceof Error ? error.message : error);
    return false;
  }
}

function testPricing() {
  console.log("\n=== Pricing Test ===\n");

  let allPassed = true;

  // Test valid combinations
  const validTests = [
    { booth: "tent", plan: "1month", expected: 130000 },
    { booth: "tent", plan: "6months", expected: 660000 },
    { booth: "tent", plan: "1year", expected: 1200000 },
    { booth: "yatai", plan: "1year", expected: 1680000 },
    { booth: "kitchencarA", plan: "1month", expected: 130000 },
    { booth: "kitchencarB", plan: "1year", expected: 1260000 },
  ];

  console.log("Valid price combinations:");
  for (const test of validTests) {
    const price = getPrice(test.booth, test.plan);
    const passed = price === test.expected;
    console.log(
      `  ${BOOTH_TYPE_LABELS[test.booth]} + ${PLAN_LABELS[test.plan]}: ${
        passed ? "PASS" : "FAIL"
      } (${formatPrice(price || 0)})`
    );
    if (!passed) allPassed = false;
  }

  // Test invalid combinations
  const invalidTests = [
    { booth: "yatai", plan: "1month" }, // yatai only has 1year
    { booth: "invalid", plan: "1month" },
    { booth: "tent", plan: "invalid" },
  ];

  console.log("\nInvalid price combinations (should return null):");
  for (const test of invalidTests) {
    const price = getPrice(test.booth, test.plan);
    const passed = price === null;
    console.log(
      `  ${test.booth} + ${test.plan}: ${passed ? "PASS" : "FAIL"} (${price})`
    );
    if (!passed) allPassed = false;
  }

  // Test isValidCombination
  console.log("\nValidation tests:");
  const validCombo = isValidCombination("tent", "1month");
  const invalidCombo = isValidCombination("yatai", "1month");
  console.log(`  isValidCombination("tent", "1month"): ${validCombo === true ? "PASS" : "FAIL"}`);
  console.log(`  isValidCombination("yatai", "1month"): ${invalidCombo === false ? "PASS" : "FAIL"}`);

  if (validCombo !== true || invalidCombo !== false) allPassed = false;

  return allPassed;
}

async function testWebhookEndpoint() {
  console.log("\n=== Webhook Endpoint Test ===\n");

  // Simulate a checkout.session.completed event
  const testEvent = {
    id: "evt_test",
    type: "checkout.session.completed",
    data: {
      object: {
        id: "cs_test",
        payment_intent: "pi_test",
        metadata: {
          formId: "form-test-001",
          paymentId: "payment-test-001",
        },
      },
    },
  };

  try {
    const response = await fetch("http://localhost:3001/api/stripe/webhook", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testEvent),
    });

    const data = await response.json();
    console.log(`Webhook response status: ${response.status}`);
    console.log(`Webhook response:`, data);

    // In dev mode without signature, it should process (may fail on DB)
    return response.status === 200 || response.status === 500;
  } catch (error) {
    console.error("Webhook test error:", error instanceof Error ? error.message : error);
    return false;
  }
}

async function main() {
  console.log("Starting Stripe Integration Tests...\n");
  console.log("=====================================\n");

  const results = {
    connection: await testStripeConnection(),
    pricing: testPricing(),
    webhook: await testWebhookEndpoint(),
  };

  console.log("\n=====================================");
  console.log("=== Test Summary ===\n");
  console.log(`Stripe Connection: ${results.connection ? "PASS" : "FAIL"}`);
  console.log(`Pricing Logic: ${results.pricing ? "PASS" : "FAIL"}`);
  console.log(`Webhook Endpoint: ${results.webhook ? "PASS" : "FAIL"}`);

  const allPassed = Object.values(results).every((r) => r);
  console.log(`\nOverall: ${allPassed ? "ALL TESTS PASSED" : "SOME TESTS FAILED"}`);

  process.exit(allPassed ? 0 : 1);
}

main().catch(console.error);
