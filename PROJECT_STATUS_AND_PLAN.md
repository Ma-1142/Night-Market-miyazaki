# Night Market Miyazaki - Project Status & Implementation Plan

**Generated:** 2025-10-31
**Last Updated:** 2025-11-03
**Current Completion:** 35-40%
**Target Completion:** 60-70% (excluding payments & messaging)

⚠️ **Status Note:** This document has been updated to reflect actual implementation progress verified against the codebase.

---

## Table of Contents
1. [Current Implementation Status](#current-implementation-status)
2. [Actual Implementation Progress](#actual-implementation-progress)
3. [Technology Stack](#technology-stack)
4. [Database Schema](#database-schema)
5. [What Can Be Completed](#what-can-be-completed)
6. [What Cannot Be Completed](#what-cannot-be-completed)
7. [Implementation Phases](#implementation-phases)
8. [Detailed Feature Specifications](#detailed-feature-specifications)
9. [API Endpoints Needed](#api-endpoints-needed)

---

## Current Implementation Status

### ✅ Completed Features (15-20%)

#### Authentication & Authorization
- **NextAuth.js v5** fully configured
- Role-based access control (USER, STAFF, ADMIN)
- Login pages for each role
- Session management
- Protected routes with redirects

#### Database & Models
- **Prisma ORM** with SQLite
- Models: User, Shop, Form, Event
- Seed script with 15 sample forms (5 food, 5 goods, 5 workshop)
- Sample users for testing

#### User/Vendor Dashboard
- Basic dashboard layout with sidebar
- **Next event banner** - Shows upcoming scheduled event with date/time
  - Currently shows 1 event (needs to show 3)
  - Pulls from user's submitted forms
  - Displays shop name, date, time
- **Form submission system** - All 3 form types complete:
  1. Food vendor form (飲食出店フォーム)
  2. Goods vendor form (物販・雑貨出店フォーム)
  3. Workshop vendor form (ワークショップ・体験・その他出店フォーム)
- **Event scheduler component** - Allows users to select participation dates
- Submitted forms history table
- Form type selection cards
- Logout functionality

#### Staff Dashboard
- Basic dashboard page exists
- Authentication working
- Minimal functionality

#### Admin Dashboard
- Basic dashboard with sidebar navigation
- **Applications management page** (`/dashboard/admin/applications`)
  - Lists all submitted forms
  - Displays: ID, vendor name, shop name, submission date
  - Detail link (route exists but page not implemented)
  - Static filter dropdowns (non-functional)
  - Static search box (non-functional)
- Logout functionality
- Sidebar with menu items (most routes not implemented)

#### Components
- `ShopForm` - Food vendor form with all fields
- `GoodsForm` - Goods vendor form
- `WorkshopForm` - Workshop vendor form
- `EventScheduler` - Event date selection interface
- `AdminSidebar` - Admin navigation menu
- `StaffSidebar` - Staff navigation menu

---

## Actual Implementation Progress

**Last Verified:** 2025-11-03

### Legend
- ✅ **Fully Implemented** - Feature is complete and working with database
- 🟡 **Partially Implemented** - UI exists but missing functionality or database integration
- ❌ **Not Implemented** - Does not exist or is placeholder only

---

### Admin Dashboard - Detailed Status

#### Applications Management
- ✅ **Applications List Page** (70%) - Functional with basic search/filter
- 🟡 **Application Detail Page** (65%) - Shows data but missing some admin features
- 🟡 **Search & Filter** (70%) - Works but UI incomplete
- 🟡 **Bulk Actions** (50%) - Checkboxes exist, limited functionality
- 🟡 **Status Management** (60%) - Can change status but no workflow automation

#### Vendor Management
- 🟡 **Vendor List** (40%) - Shows vendors but filters non-functional
- ❌ **Vendor Detail Page** (0%) - Route `/admin/vendors/[id]` doesn't exist
- ❌ **Application History View** (0%) - Not implemented
- ❌ **Export to CSV** (0%) - Not implemented
- ❌ **Admin Notes** (0%) - Not implemented

#### Event Management - ⚠️ CRITICAL ISSUE
- ❌ **Event List** (20%) - **USES HARDCODED MOCK DATA, NOT DATABASE**
- ❌ **Calendar View** (20%) - Shows UI only, no real functionality
- ❌ **Create Event** (0%) - Button exists but non-functional
- ❌ **Edit Event** (0%) - Not implemented
- ❌ **Zone Configuration** (0%) - Not in database
- ❌ **Capacity Settings** (0%) - EventConfig model missing

#### Check-in/Arrival Management
- ❌ **Arrival Dashboard** (15%) - UI only, no database integration
- ❌ **Status Tracking** (10%) - Dropdown exists but doesn't save
- ❌ **Late Vendor Detection** (0%) - Not implemented
- ❌ **Staff Check-in Interface** (0%) - Page doesn't exist
- ❌ **Arrival Reports** (0%) - Not implemented

#### Reports & Statistics
- 🟡 **Basic Statistics** (50%) - Shows totals and percentages only
- ❌ **Charts/Graphs** (0%) - Not implemented
- ❌ **CSV Export** (0%) - Not implemented
- ❌ **Date Filtering** (0%) - Not implemented
- ❌ **Monthly Trends** (0%) - Not implemented
- ❌ **Attendance Reports** (0%) - Not implemented

#### Layout/Floor Plan Management
- ✅ **Booth Assignment Grid** (70%) - Working with database
- ✅ **Auto-Lottery System** (75%) - Functional
- ✅ **Publication Controls** (80%) - Working
- 🟡 **Manual Assignment** (50%) - Can assign but no drag-drop

#### Announcements & Chat System
- ✅ **Announcements** (90%) - Fully working with targeting
- ✅ **Direct Chat** (90%) - Real-time messaging working
- ✅ **User Targeting** (85%) - Can target specific users/groups
- ✅ **Chat History** (80%) - Persistent chat storage

#### Account Security & Users
- 🟡 **User List** (40%) - Shows users with roles
- ❌ **Edit Users** (10%) - Buttons don't work
- ❌ **Audit Log** (5%) - Placeholder only

#### Notifications System
- ❌ **Notifications** (5%) - Shows "準備中" (preparing) placeholder only

---

### User/Vendor Dashboard - Detailed Status

#### Main Dashboard
- 🟡 **Next Event Display** (60%) - Shows 1 event (plan says 3)
- ✅ **Form History Table** (85%) - Working with data
- ✅ **Form Type Selection** (90%) - All cards functional
- 🟡 **Event Scheduling** (50%) - Basic date selection only

#### Form Management
- ✅ **Food Vendor Form** (95%) - Fully functional
- ✅ **Goods Vendor Form** (95%) - Fully functional
- ✅ **Workshop Form** (95%) - Fully functional
- ✅ **Form Detail View** (85%) - Shows complete submission
- ❌ **Form Editing** (0%) - Users cannot edit after submission

#### Account Management
- ❌ **Profile Edit Page** (0%) - Route doesn't exist
- ❌ **Password Change Page** (0%) - Route doesn't exist
- ✅ **Logout** (100%) - Working

---

### Staff Dashboard - Detailed Status

#### Main Dashboard
- ✅ **Staff Dashboard** (85%) - Shows vendors grouped by month, proper UI
- ✅ **Vendor List View** (80%) - Displays assigned vendors

#### Check-in Interface
- ❌ **Mobile Check-in** (0%) - Not implemented
- ❌ **Quick Status Update** (0%) - Not implemented

---

### Database Models Status

#### ✅ Implemented Models
- User, Account, Session, VerificationToken (Auth)
- Shop, Form, Event
- ChatRoom, Message, DirectMessage
- LayoutMap, LayoutAssignment, BoothAssignment, LayoutSettings

#### ❌ Missing Models (From Plan)
- Notification - For notification system
- Arrival - For check-in tracking
- Incident - For incident reporting
- Template - For template management
- AuditLog - For audit logging
- EventConfig - For event capacity and configuration

---

### Phase Completion Summary

| Phase | Plan Status | Actual % | Reality Check |
|-------|-------------|----------|---------------|
| **Phase 1: Core Admin Functions** | ✅ Complete | 60% | 🟡 Admin app detail, search working. Bulk actions partial. |
| **Phase 2: Vendor Management** | ✅ Complete | 35% | ❌ Vendor detail pages missing. No export. |
| **Phase 3: Event Management** | ✅ Complete | 40% | ❌ Uses mock data! No real event CRUD. Critical issue. |
| **Phase 4: Check-in & Arrival** | ✅ Complete | 20% | ❌ UI only. No database integration. Non-functional. |
| **Phase 5: Reports & Notifications** | ✅ Complete | 50% | 🟡 Basic stats work. Notifications not implemented. |
| **Phase 6: User Features** | ✅ Complete | 50% | 🟡 Forms work. Account pages missing. Shows 1 not 3 events. |
| **Phase 7: Additional Features** | ✅ Complete | 45% | 🟡 Layout system works. Staff mgmt, incidents, audit missing. |
| **OVERALL PROJECT** | **✅ 100%** | **40%** | **-60% gap from claimed completion** |

---

### What's Actually Working Well ✅

1. Authentication & Role-based Access Control
2. Form Submission (All 3 Types: Food, Goods, Workshop)
3. Chat & Announcements System (Real-time)
4. Direct Messaging Between Users
5. Booth Layout & Auto-Lottery System
6. Staff Dashboard Display
7. Form Viewing & History

---

### Critical Issues Identified 🚨

1. **Event Management Uses Hardcoded Mock Data** - Not connected to database
2. **No Arrival/Check-in Tracking** - Complete phase 4 is non-functional
3. **Vendor Detail Pages Missing** - Route doesn't exist
4. **User Account Management Missing** - No profile/password pages
5. **Next Events Shows 1, Not 3** - Doesn't match specification
6. **Notifications Not Implemented** - Only basic chat exists
7. **Audit Log is Placeholder** - Just shows "preparing" text
8. **Multiple Database Models Missing** - 6 models from plan not created

---

### Recommended Priority Actions

**HIGH PRIORITY** (Critical for basic functionality):
1. Fix Event Management - Connect to real database, implement CRUD
2. Implement Vendor Detail Pages - `/admin/vendors/[id]`
3. Add User Account Pages - Profile edit, password change
4. Update Next Events Display - Show 3 instead of 1

**MEDIUM PRIORITY** (Important but not blocking):
5. Implement Check-in System - Add Arrival model, build check-in interface
6. Add Notifications - Implement Notification model and UI
7. Complete Vendor Management - Export, notes, history

**LOW PRIORITY** (Nice to have):
8. Audit Log System
9. Template Management
10. Advanced Reporting

---

## Technology Stack

### Frontend
- **Next.js 16** (App Router)
- **React 19**
- **TypeScript 5.9**
- **Tailwind CSS 4.1**
- Server Components & Client Components

### Backend
- **Next.js API Routes**
- **Prisma 6.18** (ORM)
- **SQLite** (Database)

### Authentication
- **NextAuth.js v5 (Auth.js)**
- **bcryptjs** for password hashing
- Credentials provider

### Development Tools
- **tsx** for running TypeScript
- **ESLint** for code quality
- **Turbopack** for faster dev builds

---

## Database Schema

### Current Models

```prisma
model User {
  id            String   @id @default(cuid())
  name          String?
  email         String   @unique
  password      String?
  role          UserRole @default(USER)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  shops         Shop[]
  accounts      Account[]
  sessions      Session[]
}

model Shop {
  id          String   @id @default(cuid())
  name        String
  description String?
  userId      String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  forms       Form[]
}

model Form {
  id        String   @id @default(cuid())
  shopId    String
  data      Json     // Stores all form fields
  status    String   @default("pending")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  shop      Shop     @relation(fields: [shopId], references: [id], onDelete: Cascade)
  events    Event[]
}

model Event {
  id        String   @id @default(cuid())
  formId    String
  date      DateTime
  startTime String?
  endTime   String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  form      Form     @relation(fields: [formId], references: [id], onDelete: Cascade)
}
```

### Models Needed

```prisma
model Notification {
  id          String   @id @default(cuid())
  title       String
  message     String
  targetType  String   // "all", "zone", "date", "formType"
  targetValue String?  // zone name, date, form type
  isRead      Boolean  @default(false)
  createdBy   String
  createdAt   DateTime @default(now())

  creator     User     @relation(fields: [createdBy], references: [id])
}

model Arrival {
  id          String   @id @default(cuid())
  formId      String
  eventId     String
  status      String   // "not_arrived", "arrived", "setup_complete"
  arrivedAt   DateTime?
  setupAt     DateTime?
  notes       String?

  form        Form     @relation(fields: [formId], references: [id])
  event       Event    @relation(fields: [eventId], references: [id])
}

model BoothLayout {
  id          String   @id @default(cuid())
  eventId     String
  zone        String
  boothNumber String
  formId      String?
  position    Json     // {x, y, width, height}
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  event       Event    @relation(fields: [eventId], references: [id])
  form        Form?    @relation(fields: [formId], references: [id])
}

model Incident {
  id          String   @id @default(cuid())
  eventId     String
  category    String   // "safety", "complaint", "damage", "other"
  description String
  status      String   @default("open") // "open", "investigating", "resolved"
  reportedBy  String
  createdAt   DateTime @default(now())
  resolvedAt  DateTime?

  event       Event    @relation(fields: [eventId], references: [id])
  reporter    User     @relation(fields: [reportedBy], references: [id])
}

model Template {
  id          String   @id @default(cuid())
  type        String   // "condition_offer", "notification", "email"
  name        String
  content     String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model AuditLog {
  id          String   @id @default(cuid())
  userId      String
  action      String   // "create", "update", "delete", "status_change"
  entity      String   // "form", "event", "user", etc.
  entityId    String
  changes     Json?    // Before/after values
  createdAt   DateTime @default(now())

  user        User     @relation(fields: [userId], references: [id])
}

model EventConfig {
  id              String   @id @default(cuid())
  date            DateTime @unique
  maxVendors      Int
  maxFood         Int?
  maxGoods        Int?
  maxWorkshop     Int?
  zoneConfig      Json     // Zone names, capacities
  status          String   @default("planning") // "planning", "open", "closed", "completed"
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

---

## What Can Be Completed

### 🟢 HIGH CONFIDENCE - 100% Completion

#### 1. User/Vendor Features

##### A. Next Event Display Enhancement
**Current:** Shows only 1 upcoming event
**Target:** Show next 3 upcoming events

**Implementation:**
```typescript
// Update query in app/dashboard/user/page.tsx
const nextEvents = await prisma.event.findMany({
  where: {
    form: {
      shop: {
        userId: session.user.id as string,
      },
    },
    date: {
      gte: new Date(),
    },
  },
  include: {
    form: {
      include: {
        shop: true,
      },
    },
  },
  orderBy: {
    date: "asc",
  },
  take: 3, // Get 3 events instead of 1
});
```

**UI Changes:**
- Display as card grid instead of single banner
- Each card shows: date, time, shop name, days until event
- Color-coded by urgency (red if <3 days, yellow if <7 days)

**Time:** 30 minutes

---

##### B. Form Detail View Page
**Route:** `/dashboard/user/forms/[id]`
**Purpose:** View complete submitted form data

**Features:**
- Display all form fields in organized sections
- Show submission date and current status
- Status badge (pending/approved/rejected/reviewing)
- Print-friendly layout
- "Edit" button (if status is pending or rejected)
- "Back to dashboard" link

**Sections to display:**
1. Basic Information (name, contact, booth type)
2. Business Content (menu items, products, workshop details)
3. Documents (list uploaded file names)
4. Agreement (company info, signature)
5. Additional Info (SNS, remarks)
6. Status History (when submitted, when reviewed, etc.)

**Time:** 2 hours

---

##### C. Form Edit Functionality
**Route:** `/dashboard/user/forms/[id]/edit`

**Features:**
- Pre-populate form with existing data
- Only allow editing if status is "pending" or "rejected"
- Show warning message explaining edit rules
- Create new version in database (keep history)
- Reset status to "pending" after edit
- Confirmation dialog before submitting changes

**Implementation approach:**
- Reuse existing form components (ShopForm, GoodsForm, WorkshopForm)
- Add `initialData` prop to form components
- Use `React.useEffect` to populate fields

**Time:** 3 hours

---

##### D. Account Management Pages

###### Profile Edit (`/dashboard/user/account/profile`)
**Fields:**
- Business name (Shop.name)
- Business description
- Contact person name
- Phone number
- Email (read-only, show warning)
- Company address

**Time:** 1.5 hours

###### Password Change (`/dashboard/user/account/password`)
**Fields:**
- Current password (verify)
- New password
- Confirm new password

**Validation:**
- Minimum 8 characters
- bcrypt comparison for current password
- Match check for confirmation

**Time:** 1 hour

---

##### E. Enhanced Event Scheduling
**Current:** Basic EventScheduler component exists
**Improvements needed:**

1. **Calendar view** - Show full month with available dates highlighted
2. **Time slot selection** - If event has multiple time slots
3. **Conflict detection** - Prevent double-booking
4. **Capacity warnings** - Show "Almost full" indicators
5. **Confirmation modal** - Review before submitting

**Time:** 2 hours

---

#### 2. Admin Features

##### A. Application Detail Page ⭐ PRIORITY
**Route:** `/dashboard/admin/applications/[id]`

**Layout:**
```
┌─────────────────────────────────────────────┐
│ Header: Shop Name + Application ID          │
│ [Back] [Approve] [Reject] [Edit]            │
├─────────────────────────────────────────────┤
│                                             │
│ Status Timeline                             │
│ ○──○──○──○                                 │
│ Submitted → Reviewing → Approved            │
│                                             │
│ ┌─────────────────┐ ┌──────────────────┐  │
│ │ Basic Info      │ │ Documents        │  │
│ │ • Shop name     │ │ ✓ Permit         │  │
│ │ • Contact       │ │ ✓ Certificate    │  │
│ │ • Phone         │ │ ✗ Insurance      │  │
│ └─────────────────┘ └──────────────────┘  │
│                                             │
│ Business Details                            │
│ [Full form data display]                    │
│                                             │
│ ┌─────────────────────────────────────────┐│
│ │ Admin Actions                           ││
│ │ Status: [Dropdown: Pending/Reviewing/  ││
│ │         Approved/Rejected]              ││
│ │ Notes: [Text area for admin notes]     ││
│ │ [Save]                                  ││
│ └─────────────────────────────────────────┘│
└─────────────────────────────────────────────┘
```

**Features:**
- Full form data display
- Status change with confirmation
- Admin notes/feedback section
- Document checklist
- Vendor contact information prominently displayed
- Action buttons: Approve, Reject, Request Changes
- Email notification trigger on status change

**Time:** 3 hours

---

##### B. Search & Filter Implementation
**Location:** `/dashboard/admin/applications`

**Search capabilities:**
```typescript
// Search by:
- Shop name (form.shop.name)
- Vendor name (form.shop.user.name)
- Email (form.shop.user.email)
- Application ID (form.id)
```

**Filters:**
```typescript
// Filter by:
- Status (pending/approved/rejected/reviewing)
- Form Type (food/goods/workshop)
- Date Range (createdAt)
- Participation Plan (1month/6months/1year)
- Booth Type (yatai/kitchencar/tent)
```

**Implementation:**
- Client-side filtering for <100 records
- Server-side filtering with Prisma for >100 records
- URL query parameters to preserve filter state
- "Clear filters" button
- Filter count badge

**UI Enhancements:**
- Sticky filter bar
- Loading states
- "No results" message with suggestions
- Export filtered results to CSV

**Time:** 3 hours

---

##### C. Bulk Actions
**Features:**
- Select multiple applications (checkboxes)
- Bulk approve
- Bulk reject
- Bulk status change
- Confirmation modal showing affected vendors

**Time:** 2 hours

---

##### D. Vendor Management System
**Route:** `/dashboard/admin/vendors`

**Vendor List:**
```
┌────────────────────────────────────────────┐
│ Search: [____________] [Filters ▾]         │
├────┬─────────┬───────────┬────────┬────────┤
│ ID │ Name    │ Shop Name │ Status │ Forms  │
├────┼─────────┼───────────┼────────┼────────┤
│ 01 │ 田中 太郎 │ チキン南蛮 │ Active │ 3      │
│ 02 │ 佐藤 花子 │ マンゴー   │ Active │ 2      │
└────┴─────────┴───────────┴────────┴────────┘
```

**Vendor Detail Page (`/dashboard/admin/vendors/[id]`):**
- Contact information
- All shops owned
- Application history (with status)
- Attendance history
- Payment history (placeholder for future)
- Notes section (admin only)

**Time:** 4 hours

---

##### E. Event/Schedule Management System ⭐ PRIORITY
**Route:** `/dashboard/admin/events`

**Event Calendar View:**
```
November 2025
┌─────┬─────┬─────┬─────┬─────┬─────┬─────┐
│ Sun │ Mon │ Tue │ Wed │ Thu │ Fri │ Sat │
├─────┼─────┼─────┼─────┼─────┼─────┼─────┤
│  1  │  2  │  3  │  4  │  5  │  6  │  7  │
│     │     │     │     │     │ 🎪 │ 🎪 │
│     │     │     │     │     │15/20│18/20│
└─────┴─────┴─────┴─────┴─────┴─────┴─────┘

🎪 = Event scheduled
15/20 = 15 vendors confirmed / 20 capacity
```

**Create Event Modal:**
```
Create New Event
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Date: [Calendar picker]
Start Time: [09:00]
End Time: [18:00]

Capacity Settings
├─ Total Capacity: [50] vendors
├─ Food: [20] vendors
├─ Goods: [20] vendors
└─ Workshop: [10] vendors

Zone Configuration
├─ Zone A: [20] booths
├─ Zone B: [15] booths
└─ Zone C: [15] booths

Status: ○ Draft  ○ Open for Applications  ○ Closed

[Cancel] [Save Draft] [Publish]
```

**Features:**
- Create/edit/delete events
- Set capacity per vendor type
- Configure zones and booth numbers
- Set application deadline
- Auto-close when capacity reached
- Duplicate event (for weekly recurring)
- Event status: Draft → Open → Closed → Completed

**Event Detail Page:**
- Vendor list for this event
- Capacity progress bar
- Booth assignments
- Check-in status
- Weather widget (placeholder)
- Quick actions (notify vendors, export list)

**Time:** 5 hours

---

##### F. Staff Management
**Route:** `/dashboard/admin/staff`

**Features:**
- Staff list table
- Add staff member form
  - Name, email, phone
  - Generate password or let them set
  - Send invitation email (basic, no fancy styling)
- Edit staff info
- Deactivate/reactivate
- Role assignment (currently just STAFF, but extensible)

**Staff Detail:**
- Personal info
- Assigned events
- Activity log

**Time:** 3 hours

---

##### G. Check-in/Arrival Management System
**Route:** `/dashboard/admin/arrivals`

**Real-time Arrival Dashboard:**
```
Today's Event - November 15, 2025
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Status Overview
┌────────────┬────────────┬──────────────┐
│ Not Arrived│   Arrived  │Setup Complete│
│     12     │     25     │      8       │
└────────────┴────────────┴──────────────┘

⚠️ Alerts
• 3 vendors late (>30 min past start)
• 2 vendors no-show (not responded)

Vendor List
┌──────────────┬────────┬─────────┬────────┐
│ Shop Name    │ Zone   │ Status  │ Action │
├──────────────┼────────┼─────────┼────────┤
│ チキン南蛮    │ Zone A │ ⚫ Late │ [Call] │
│ マンゴー      │ Zone B │ ✓ Setup│   -    │
│ 炭火焼き      │ Zone A │ ⏱ Arr. │ [Done] │
└──────────────┴────────┴─────────┴────────┘
```

**Features:**
- Filter by status (all/not arrived/arrived/setup/late/no-show)
- One-click status update
- Automatic late detection (compare to event start time)
- Send reminder notification
- Notes field per vendor
- Color-coded status indicators
- Export arrival report

**Mobile-optimized** for staff to use on tablets during event

**Time:** 4 hours

---

##### H. Reports & Statistics
**Route:** `/dashboard/admin/reports`

**Dashboard Metrics:**
```
┌─────────────────────────────────────────┐
│         Application Statistics          │
├─────────────────────────────────────────┤
│ Total Applications:           145       │
│ ├─ Pending:                    23       │
│ ├─ Approved:                   98       │
│ ├─ Rejected:                   24       │
│ └─ Approval Rate:             80%       │
│                                         │
│ Form Type Distribution                  │
│ ├─ Food:        60 (41%)  ████████      │
│ ├─ Goods:       50 (34%)  ███████       │
│ └─ Workshop:    35 (24%)  █████         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│        Monthly Application Trend        │
├─────────────────────────────────────────┤
│  40│                             ●       │
│  30│                       ●   ●         │
│  20│               ●   ●                 │
│  10│       ●   ●                         │
│   0│───────────────────────────────────  │
│     Jan Feb Mar Apr May Jun Jul Aug     │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│          Attendance Statistics          │
├─────────────────────────────────────────┤
│ Average Attendance Rate:        92%     │
│ Total Events Held:               18     │
│ Total Vendor Participations:    450     │
│ Average Vendors per Event:       25     │
└─────────────────────────────────────────┘
```

**Reports Available:**
1. **Application Report**
   - Total, pending, approved, rejected
   - By form type
   - By month
   - Approval rate trend

2. **Attendance Report**
   - Per event attendance
   - Vendor attendance history
   - Late/no-show statistics
   - Setup time average

3. **Vendor Report**
   - Active vendors
   - New vendors per month
   - Returning vendor rate
   - Most frequent vendors

4. **Export Options:**
   - CSV download
   - Date range selection
   - Filter by form type, status

**Time:** 4 hours

---

##### I. Notification System (Basic)
**Route:** `/dashboard/admin/notifications`

**Create Notification:**
```
Create Announcement
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Target Audience
○ All Vendors
○ Specific Event
  └─ [Select Event ▾]
○ Specific Zone
  └─ Zone: [Zone A ▾]
○ Vendor Type
  └─ Type: [Food ▾]

Notification Details
Title: [_____________________________]

Message:
┌──────────────────────────────────┐
│                                  │
│                                  │
│                                  │
└──────────────────────────────────┘

Priority: ○ Normal  ○ Important  ○ Urgent

[Send Now] [Save as Draft] [Schedule]
```

**Notification List:**
- Sent notifications history
- Draft notifications
- Scheduled notifications
- View recipients and read status

**User Side:**
- Notification badge on dashboard
- Notification center dropdown
- Mark as read
- Filter by unread/all

**Time:** 4 hours

---

##### J. Template Management
**Route:** `/dashboard/admin/templates`

**Template Types:**
1. **Condition Offer Templates** - For requesting document revisions
2. **Notification Templates** - Common announcements
3. **Email Templates** - (Basic, just text)

**Features:**
- Create/edit/delete templates
- Preview functionality
- Variable placeholders (e.g., `{{shop_name}}`, `{{date}}`)
- Categories/tags for organization

**Time:** 2 hours

---

##### K. Audit Log System
**Route:** `/dashboard/admin/audit-log`

**Log Entries:**
```
┌───────────────┬────────┬────────┬────────────────┐
│ Timestamp     │ User   │ Action │ Details        │
├───────────────┼────────┼────────┼────────────────┤
│ 2025-10-31    │ admin@ │ UPDATE │ Changed form   │
│ 14:23:15      │ test   │ FORM   │ #abc123 status │
│               │        │        │ pending→approved│
├───────────────┼────────┼────────┼────────────────┤
│ 2025-10-31    │ admin@ │ CREATE │ Created event  │
│ 14:20:03      │ test   │ EVENT  │ for 2025-11-15 │
└───────────────┴────────┴────────┴────────────────┘
```

**Logged Actions:**
- Form status changes
- Event creation/modification
- Vendor information updates
- User account changes
- Booth assignments
- Important deletions

**Features:**
- Filter by user, action type, date range
- Search by entity ID
- Export audit log
- View details (before/after values)

**Time:** 3 hours

---

#### 3. Staff Features

##### A. Staff Dashboard
**Route:** `/dashboard/staff`

**Components:**
- Today's event info
- Quick check-in interface
- Assigned vendor list
- Important announcements
- Quick actions panel

**Time:** 2 hours

---

##### B. Staff Check-in Interface
**Route:** `/dashboard/staff/checkin`

**Mobile-optimized interface:**
```
┌─────────────────────────────────┐
│     Event: November 15, 2025    │
│         Zone A Assigned         │
├─────────────────────────────────┤
│ Search: [_______________] 🔍    │
├─────────────────────────────────┤
│                                 │
│ ┌──────────────────────────┐   │
│ │ 🍜 チキン南蛮本舗          │   │
│ │ Booth: A-12              │   │
│ │ Status: Not Arrived      │   │
│ │ [✓ Mark Arrived]         │   │
│ └──────────────────────────┘   │
│                                 │
│ ┌──────────────────────────┐   │
│ │ 🥭 マンゴーカフェ          │   │
│ │ Booth: A-15              │   │
│ │ ✓ Arrived 09:45          │   │
│ │ [✓ Setup Complete]       │   │
│ └──────────────────────────┘   │
└─────────────────────────────────┘
```

**Features:**
- Large buttons for touch
- Quick search/scan
- One-tap status update
- Add notes
- Call vendor button (uses tel: link)
- Works offline (with IndexedDB cache, sync when online)

**Time:** 3 hours

---

### ⚠️ MEDIUM CONFIDENCE - Basic Version (70-80%)

#### 4. Layout/Floor Plan Management

##### A. Basic Layout Management
**Route:** `/dashboard/admin/layout`

**What CAN be done:**
- Upload static floor plan image
- Manual booth assignment (drag & drop)
- Zone labeling
- Save layout per event
- Display layout to vendors

**What CANNOT be done:**
- Automatic lottery/assignment algorithm (too complex)
- Complex spatial calculations
- Auto-optimization

**Implementation:**
```javascript
// Simple booth assignment
{
  eventId: "evt_123",
  zone: "A",
  boothNumber: "A-12",
  formId: "form_456",
  position: { x: 100, y: 200, width: 50, height: 50 }
}
```

**UI:**
- Grid view with booth numbers
- Dropdown to assign vendor to booth
- Color coding by vendor type
- Print/export layout
- Version history

**Time:** 5 hours

---

##### B. Incident Reporting (Text-only)
**Route:** `/dashboard/admin/incidents`

**Create Incident:**
```
Report Incident
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Event: [Select Event ▾]

Category:
○ Safety Issue
○ Customer Complaint
○ Equipment Damage
○ Vendor Conflict
○ Other

Related Vendor (optional):
[Search vendor ▾]

Description:
┌──────────────────────────────────┐
│                                  │
│                                  │
└──────────────────────────────────┘

Severity:
○ Low  ○ Medium  ○ High  ○ Critical

[Submit Report]
```

**Incident List:**
- Filter by status, severity, category
- Assign to staff member
- Update status (open → investigating → resolved)
- Add follow-up notes
- Timestamp tracking

**Note:** Photo uploads NOT included (requires file storage setup)

**Time:** 3 hours

---

##### C. Fire Safety Tracking
**Route:** `/dashboard/admin/safety`

**Features:**
- List all vendors using fire/gas
- Fire extinguisher assignment
- Safety checklist per event
- Pre-event safety report
- Filter by event, zone

**Table:**
```
┌────────────┬──────┬────────────┬────────────┐
│ Vendor     │ Zone │ Fire Use   │ Extinguisher│
├────────────┼──────┼────────────┼────────────┤
│ 炭火焼き    │ A-03 │ Charcoal  │ EXT-A-01   │
│ うどん      │ B-12 │ Gas       │ EXT-B-03   │
└────────────┴──────┴────────────┴────────────┘
```

**Time:** 2 hours

---

## What CANNOT Be Completed

### ❌ Excluded by User Request

#### 1. Payment System
- Stripe integration
- Invoice generation (PDF)
- Receipt generation (PDF)
- Payment tracking
- Online payment processing
- Bank transfer reporting
- Payment history
- Unpaid alerts

**Why excluded:** Requires Stripe API, PDF generation library, and complex financial logic

---

#### 2. Messaging/Chat System
- Real-time chat between admin and vendors
- Message threads
- WebSocket connections
- Chat history
- Read receipts
- Typing indicators

**Why excluded:** Requires WebSocket server (Socket.io or Pusher), real-time infrastructure

---

### ❌ Too Complex/Requires External Services

#### 3. File Upload System
- Document uploads (permits, certificates)
- Image uploads (products, incidents)
- File storage (S3, Cloudinary)
- File preview
- PDF generation

**Why too complex:**
- Requires external storage service (AWS S3, Cloudinary, etc.)
- File validation and security
- MIME type checking
- Virus scanning for production
- CDN setup for performance

**Possible workaround:**
- Store file upload status as "Uploaded" boolean
- Display file names only (stored in JSON)
- Admin manually verifies documents offline

---

#### 4. Automatic Lottery/Assignment Algorithm
- Fair booth assignment algorithm
- Automatic vendor distribution
- Preference matching
- Conflict resolution
- Optimization algorithms

**Why too complex:**
- Requires complex constraint satisfaction
- Multiple variables (vendor type, zone capacity, preferences)
- Fair random selection algorithm
- Conflict detection and resolution
- May take hours to implement correctly

**Possible workaround:**
- Manual assignment with helper tools
- Random shuffle suggestions (simple)
- Conflict warnings only

---

#### 5. Advanced Email System
- HTML email templates
- Email scheduling
- Bulk email sending
- Email tracking (opens, clicks)
- SMTP configuration

**Why too complex:**
- Requires email service (SendGrid, Mailgun)
- HTML template engine
- Email delivery tracking
- Bounce handling
- Spam compliance

**Possible workaround:**
- In-app notifications only
- Basic text email (using Next.js API + nodemailer)
- No tracking or fancy formatting

---

## Implementation Phases

### Phase 1: Core Admin Functions (5-6 hours) - 🟡 60% Complete
**Goal:** Enable admins to manage applications effectively

#### Tasks:
1. 🟡 Application detail page with full form data display (Partial - missing some features)
2. 🟡 Status management (pending/reviewing/approved/rejected) (Works but no automation)
3. 🟡 Search functionality (by name, shop, email, ID) (Basic implementation)
4. 🟡 Filter system (status, form type, date range) (UI incomplete)
5. 🟡 Bulk actions (approve/reject multiple) (Limited functionality)

**Deliverables:**
- `/dashboard/admin/applications/[id]` - Full detail view
- Enhanced `/dashboard/admin/applications` - With working search/filters
- API endpoint: `PATCH /api/admin/applications/[id]` - Update status
- API endpoint: `POST /api/admin/applications/bulk` - Bulk actions

**Testing:**
- Create/view application details
- Change application status
- Search for specific vendors
- Filter by multiple criteria
- Approve 5 applications at once

---

### Phase 2: Vendor Management (4-5 hours) - ❌ 35% Complete
**Goal:** Centralized vendor information and history

#### Tasks:
1. 🟡 Vendor list page with search/filter (List exists, filters non-functional)
2. ❌ Vendor detail page (contact info, shops, history) (Route doesn't exist)
3. ❌ Application history per vendor (Not implemented)
4. ❌ Admin notes section (Not implemented)
5. ❌ Export vendor list to CSV (Not implemented)

**Deliverables:**
- `/dashboard/admin/vendors` - Vendor list
- `/dashboard/admin/vendors/[id]` - Vendor detail
- API endpoint: `GET /api/admin/vendors` - List with filters
- API endpoint: `GET /api/admin/vendors/[id]` - Detail
- API endpoint: `PATCH /api/admin/vendors/[id]/notes` - Update notes

**Testing:**
- View all vendors
- Search for specific vendor
- View vendor's application history
- Add admin notes
- Export vendor list

---

### Phase 3: Event Management (5-6 hours) - ❌ 40% Complete - ⚠️ CRITICAL ISSUE
**Goal:** Create and manage events, set capacity

**🚨 CRITICAL:** Event management uses hardcoded mock data, not database!

#### Tasks:
1. ❌ Event calendar view (UI only, shows mock data)
2. ❌ Create event form with capacity settings (Button non-functional)
3. ❌ Edit/delete events (Not implemented)
4. ❌ Zone configuration (Not in database)
5. ❌ Event detail page showing vendor list (Mock data only)
6. ❌ Duplicate event feature (for recurring weekly events) (Not implemented)

**Deliverables:**
- `/dashboard/admin/events` - Calendar view
- `/dashboard/admin/events/new` - Create event
- `/dashboard/admin/events/[id]` - Event detail
- `/dashboard/admin/events/[id]/edit` - Edit event
- Database migration: Add `EventConfig` model
- API endpoints for CRUD operations

**Testing:**
- Create event for next week
- Set capacity (20 food, 15 goods, 10 workshop)
- Configure zones (A, B, C)
- Duplicate event for following week
- View event details with vendor list

---

### Phase 4: Check-in & Arrival (4-5 hours) - ❌ 20% Complete
**Goal:** Track vendor arrivals on event day

#### Tasks:
1. ❌ Arrival dashboard with status overview (UI only, no database)
2. ❌ Vendor list with status indicators (Dropdown exists but doesn't save)
3. ❌ One-click status update (Not functional)
4. ❌ Late/no-show detection and alerts (Not implemented)
5. ❌ Staff mobile interface for check-in (Page doesn't exist)
6. ❌ Export arrival report (Not implemented)

**Deliverables:**
- `/dashboard/admin/arrivals` - Admin arrival dashboard
- `/dashboard/admin/arrivals/[eventId]` - Event-specific arrivals
- `/dashboard/staff/checkin` - Mobile-optimized staff interface
- Database migration: Add `Arrival` model
- API endpoint: `POST /api/arrivals/[id]` - Update arrival status
- API endpoint: `GET /api/arrivals/late` - Get late vendors

**Testing:**
- View today's arrivals
- Mark vendor as arrived
- Mark vendor as setup complete
- Identify late vendors
- Send reminder to late vendor
- Export arrival report

---

### Phase 5: Reports & Notifications (4-5 hours) - 🟡 50% Complete
**Goal:** Data insights and vendor communication

#### Tasks:
1. 🟡 Reports dashboard with key metrics (Basic stats only)
2. 🟡 Application statistics (total, pending, approved, rejection rate) (Shows totals, no trends)
3. ❌ Attendance statistics (Not implemented)
4. ❌ Monthly trend charts (simple bar charts) (Not implemented)
5. ❌ CSV export functionality (Not implemented)
6. ❌ Notification creation interface (Shows "準備中" placeholder)
7. ❌ Notification targeting (all, event, zone, type) (Not implemented)
8. ❌ Notification list and history (Not implemented)
9. ❌ User notification center (Not implemented)

**Deliverables:**
- `/dashboard/admin/reports` - Reports dashboard
- `/dashboard/admin/notifications` - Create/manage notifications
- Database migration: Add `Notification` model
- API endpoint: `POST /api/notifications` - Create notification
- API endpoint: `GET /api/notifications` - List (with filters)
- Component: `NotificationCenter` - User-facing dropdown

**Testing:**
- View application statistics
- View monthly trend chart
- Export report to CSV
- Create notification for all vendors
- Create notification for specific event
- View notification as vendor
- Mark notification as read

---

### Phase 6: User Features & Account Management (3-4 hours) - 🟡 50% Complete
**Goal:** Enhanced user experience for vendors

#### Tasks:
1. ❌ Show next 3 events (instead of 1) (Still shows only 1)
2. ✅ Form detail page for users (Working)
3. ❌ Profile edit page (Route doesn't exist)
4. ❌ Password change page (Route doesn't exist)
5. ❌ Notification center integration (Not implemented)
6. 🟡 Better event scheduler (calendar view) (Basic date selection only)

**Deliverables:**
- Enhanced `/dashboard/user` - Show 3 upcoming events
- `/dashboard/user/forms/[id]` - View submitted form
- `/dashboard/user/account/profile` - Edit profile
- `/dashboard/user/account/password` - Change password
- Enhanced `EventScheduler` component
- API endpoint: `PATCH /api/user/profile` - Update profile
- API endpoint: `POST /api/user/password` - Change password

**Testing:**
- View next 3 events
- View submitted form details
- Edit profile information
- Change password
- Schedule events using calendar
- View notifications

---

### Phase 7: Additional Features (4-5 hours) - 🟡 45% Complete
**Goal:** Complete remaining admin tools

#### Tasks:
1. ❌ Staff management (list, add, edit) (Not implemented)
2. ❌ Template management (Not implemented)
3. ✅ Basic layout management (manual booth assignment) (Working with auto-lottery)
4. ❌ Incident reporting (text-only) (Not implemented)
5. ❌ Fire safety tracking (Not implemented)
6. ❌ Audit log system (Placeholder only)

**Deliverables:**
- `/dashboard/admin/staff` - Staff management
- `/dashboard/admin/templates` - Template CRUD
- `/dashboard/admin/layout` - Floor plan with manual assignment
- `/dashboard/admin/incidents` - Incident reports
- `/dashboard/admin/safety` - Fire safety list
- `/dashboard/admin/audit-log` - System audit log
- Database migrations for all new models
- Corresponding API endpoints

**Testing:**
- Add new staff member
- Create notification template
- Assign vendor to booth
- Create incident report
- Mark vendor as using fire
- View audit log entries

---

## Detailed Feature Specifications

### Application Detail Page

**Route:** `/app/dashboard/admin/applications/[id]/page.tsx`

```typescript
// Data Structure
interface ApplicationDetail {
  id: string;
  shopName: string;
  vendorName: string;
  vendorEmail: string;
  vendorPhone: string;
  status: 'pending' | 'reviewing' | 'approved' | 'rejected';
  formType: 'food' | 'goods' | 'workshop';
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  adminNotes?: string;
  formData: FoodFormData | GoodsFormData | WorkshopFormData;
}

// Component Structure
export default async function ApplicationDetailPage({
  params
}: {
  params: { id: string }
}) {
  const form = await prisma.form.findUnique({
    where: { id: params.id },
    include: {
      shop: {
        include: {
          user: true
        }
      }
    }
  });

  const formData = form.data as FormDataType;

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="p-8 pl-20">
        {/* Header with actions */}
        <ApplicationHeader form={form} />

        {/* Status timeline */}
        <StatusTimeline status={form.status} />

        {/* Form data sections */}
        <BasicInformation data={formData} />
        <BusinessDetails data={formData} />
        <Documents data={formData} />
        <Agreement data={formData} />

        {/* Admin actions */}
        <AdminActionsPanel formId={form.id} currentStatus={form.status} />
      </div>
    </div>
  );
}
```

**Components to create:**

1. `ApplicationHeader.tsx`
```tsx
export function ApplicationHeader({ form }: { form: FormWithRelations }) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <Link href="/dashboard/admin/applications" className="text-blue-600">
          ← Back to Applications
        </Link>
        <h1 className="text-3xl font-bold">{form.shop.name}</h1>
        <p className="text-gray-600">Application ID: {form.id.slice(0, 8)}</p>
      </div>
      <div className="flex gap-3">
        <button className="btn-approve">Approve</button>
        <button className="btn-reject">Reject</button>
        <button className="btn-secondary">Request Changes</button>
      </div>
    </div>
  );
}
```

2. `StatusTimeline.tsx`
```tsx
export function StatusTimeline({ status }: { status: string }) {
  const steps = [
    { key: 'pending', label: 'Submitted' },
    { key: 'reviewing', label: 'Reviewing' },
    { key: 'approved', label: 'Approved' }
  ];

  return (
    <div className="mb-8 bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between">
        {steps.map((step, index) => (
          <div key={step.key} className="flex items-center">
            <div className={`
              h-10 w-10 rounded-full flex items-center justify-center
              ${status === step.key ? 'bg-blue-600 text-white' : 'bg-gray-200'}
            `}>
              {index + 1}
            </div>
            <span className="ml-2">{step.label}</span>
            {index < steps.length - 1 && (
              <div className="w-24 h-1 bg-gray-200 ml-4" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

3. `AdminActionsPanel.tsx`
```tsx
'use client';

export function AdminActionsPanel({
  formId,
  currentStatus
}: {
  formId: string;
  currentStatus: string;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [notes, setNotes] = useState('');

  async function handleSave() {
    const res = await fetch(`/api/admin/applications/${formId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, adminNotes: notes })
    });

    if (res.ok) {
      // Show success message
      // Optionally refresh or redirect
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow mt-6">
      <h3 className="text-lg font-bold mb-4">Admin Actions</h3>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="pending">Pending</option>
          <option value="reviewing">Reviewing</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Admin Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          className="w-full border rounded px-3 py-2"
          placeholder="Internal notes (not visible to vendor)"
        />
      </div>

      <button onClick={handleSave} className="btn-primary">
        Save Changes
      </button>
    </div>
  );
}
```

---

### Search & Filter Implementation

**Location:** `/app/dashboard/admin/applications/page.tsx`

```typescript
// URL structure with query params
// /dashboard/admin/applications?search=chicken&status=approved&type=food&dateFrom=2025-01-01

interface FilterParams {
  search?: string;
  status?: string;
  formType?: string;
  dateFrom?: string;
  dateTo?: string;
  plan?: string;
  boothType?: string;
}

export default async function ApplicationsPage({
  searchParams
}: {
  searchParams: FilterParams
}) {
  // Build Prisma query
  const where: Prisma.FormWhereInput = {};

  // Search across multiple fields
  if (searchParams.search) {
    where.OR = [
      { shop: { name: { contains: searchParams.search, mode: 'insensitive' } } },
      { shop: { user: { name: { contains: searchParams.search } } } },
      { shop: { user: { email: { contains: searchParams.search } } } },
      { id: { contains: searchParams.search } }
    ];
  }

  // Filter by status
  if (searchParams.status) {
    where.status = searchParams.status;
  }

  // Filter by form type
  if (searchParams.formType) {
    where.data = {
      path: ['formType'],
      equals: searchParams.formType
    };
  }

  // Filter by date range
  if (searchParams.dateFrom || searchParams.dateTo) {
    where.createdAt = {};
    if (searchParams.dateFrom) {
      where.createdAt.gte = new Date(searchParams.dateFrom);
    }
    if (searchParams.dateTo) {
      where.createdAt.lte = new Date(searchParams.dateTo);
    }
  }

  const forms = await prisma.form.findMany({
    where,
    include: {
      shop: {
        include: {
          user: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="p-8 pl-20">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">応募管理</h1>
        </div>

        {/* Filters Component */}
        <ApplicationFilters />

        {/* Results */}
        <ApplicationTable forms={forms} />
      </div>
    </div>
  );
}
```

**Filter Component:**

```tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export function ApplicationFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`/dashboard/admin/applications?${params.toString()}`);
  }

  function clearFilters() {
    router.push('/dashboard/admin/applications');
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="grid grid-cols-4 gap-4 mb-4">
        {/* Search */}
        <input
          type="text"
          placeholder="Search by name, shop, email..."
          defaultValue={searchParams.get('search') || ''}
          onChange={(e) => updateFilter('search', e.target.value)}
          className="border rounded px-3 py-2"
        />

        {/* Status filter */}
        <select
          defaultValue={searchParams.get('status') || ''}
          onChange={(e) => updateFilter('status', e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="reviewing">Reviewing</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>

        {/* Form type filter */}
        <select
          defaultValue={searchParams.get('formType') || ''}
          onChange={(e) => updateFilter('formType', e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">All Types</option>
          <option value="food">Food</option>
          <option value="goods">Goods</option>
          <option value="workshop">Workshop</option>
        </select>

        {/* Date range */}
        <input
          type="date"
          defaultValue={searchParams.get('dateFrom') || ''}
          onChange={(e) => updateFilter('dateFrom', e.target.value)}
          className="border rounded px-3 py-2"
        />
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {searchParams.toString() && (
            <>
              Active filters:
              {searchParams.get('search') && (
                <span className="ml-2 px-2 py-1 bg-blue-100 rounded">
                  Search: {searchParams.get('search')}
                </span>
              )}
              {searchParams.get('status') && (
                <span className="ml-2 px-2 py-1 bg-blue-100 rounded">
                  Status: {searchParams.get('status')}
                </span>
              )}
            </>
          )}
        </div>

        {searchParams.toString() && (
          <button
            onClick={clearFilters}
            className="text-blue-600 hover:underline text-sm"
          >
            Clear all filters
          </button>
        )}
      </div>
    </div>
  );
}
```

---

### Event Management System

**Event Model (needs migration):**

```prisma
model EventConfig {
  id              String   @id @default(cuid())
  date            DateTime @unique
  startTime       String
  endTime         String
  maxVendors      Int
  maxFood         Int?
  maxGoods        Int?
  maxWorkshop     Int?
  zoneConfig      Json     // { zones: [{ name: "A", capacity: 20 }, ...] }
  status          String   @default("planning")
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

**Calendar Component:**

```tsx
'use client';

import { useState } from 'react';

export function EventCalendar({ events }: { events: EventConfig[] }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const eventsByDate = events.reduce((acc, event) => {
    const dateKey = event.date.toISOString().split('T')[0];
    acc[dateKey] = event;
    return acc;
  }, {} as Record<string, EventConfig>);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      {/* Month navigation */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => {
          setCurrentMonth(new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth() - 1
          ));
        }}>
          ← Previous
        </button>

        <h2 className="text-xl font-bold">
          {currentMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
        </h2>

        <button onClick={() => {
          setCurrentMonth(new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth() + 1
          ));
        }}>
          Next →
        </button>
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-bold text-sm p-2">
            {day}
          </div>
        ))}

        {/* Empty cells for days before month starts */}
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="p-2" />
        ))}

        {/* Days of month */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const date = new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth(),
            day
          );
          const dateKey = date.toISOString().split('T')[0];
          const event = eventsByDate[dateKey];

          return (
            <div
              key={day}
              className={`
                p-2 border rounded min-h-[80px] cursor-pointer
                hover:bg-gray-50
                ${event ? 'bg-blue-50 border-blue-300' : ''}
              `}
              onClick={() => {
                if (event) {
                  // Navigate to event detail
                  window.location.href = `/dashboard/admin/events/${event.id}`;
                } else {
                  // Open create event modal for this date
                  // setCreateEventDate(date);
                }
              }}
            >
              <div className="text-sm font-bold">{day}</div>
              {event && (
                <div className="mt-1">
                  <div className="text-xs">🎪 Event</div>
                  <div className="text-xs text-gray-600">
                    {event.maxVendors} vendors
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4">
        <button className="btn-primary">
          + Create New Event
        </button>
      </div>
    </div>
  );
}
```

---

## API Endpoints Needed

### Application Management

```typescript
// GET /api/admin/applications
// Query params: search, status, formType, dateFrom, dateTo
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  // ... build Prisma query from search params
  const forms = await prisma.form.findMany({ where, include });
  return Response.json(forms);
}

// GET /api/admin/applications/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const form = await prisma.form.findUnique({
    where: { id: params.id },
    include: { shop: { include: { user: true } }, events: true }
  });
  return Response.json(form);
}

// PATCH /api/admin/applications/[id]
// Body: { status?, adminNotes? }
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const updated = await prisma.form.update({
    where: { id: params.id },
    data: {
      status: body.status,
      adminNotes: body.adminNotes
    }
  });

  // Create audit log
  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: 'UPDATE_STATUS',
      entity: 'form',
      entityId: params.id,
      changes: { status: { from: oldStatus, to: body.status } }
    }
  });

  return Response.json(updated);
}

// POST /api/admin/applications/bulk
// Body: { ids: string[], action: 'approve' | 'reject' }
export async function POST(request: Request) {
  const { ids, action } = await request.json();
  const newStatus = action === 'approve' ? 'approved' : 'rejected';

  await prisma.form.updateMany({
    where: { id: { in: ids } },
    data: { status: newStatus }
  });

  return Response.json({ success: true, count: ids.length });
}
```

### Event Management

```typescript
// POST /api/admin/events
// Body: EventConfig
export async function POST(request: Request) {
  const body = await request.json();
  const event = await prisma.eventConfig.create({
    data: {
      date: new Date(body.date),
      startTime: body.startTime,
      endTime: body.endTime,
      maxVendors: body.maxVendors,
      maxFood: body.maxFood,
      maxGoods: body.maxGoods,
      maxWorkshop: body.maxWorkshop,
      zoneConfig: body.zoneConfig,
      status: body.status || 'planning'
    }
  });

  return Response.json(event);
}

// GET /api/admin/events/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const event = await prisma.eventConfig.findUnique({
    where: { id: params.id }
  });

  // Get vendors for this event
  const vendors = await prisma.event.findMany({
    where: {
      date: event.date
    },
    include: {
      form: {
        include: {
          shop: {
            include: {
              user: true
            }
          }
        }
      }
    }
  });

  return Response.json({ event, vendors });
}
```

### Arrival Management

```typescript
// POST /api/arrivals/[id]
// Body: { status: 'not_arrived' | 'arrived' | 'setup_complete' }
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { status } = await request.json();

  const arrival = await prisma.arrival.upsert({
    where: { id: params.id },
    create: {
      formId: params.id,
      eventId: /* current event */,
      status,
      arrivedAt: status === 'arrived' ? new Date() : null,
      setupAt: status === 'setup_complete' ? new Date() : null
    },
    update: {
      status,
      arrivedAt: status === 'arrived' ? new Date() : null,
      setupAt: status === 'setup_complete' ? new Date() : null
    }
  });

  return Response.json(arrival);
}

// GET /api/arrivals/late?eventId=xxx
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get('eventId');

  const event = await prisma.eventConfig.findUnique({
    where: { id: eventId }
  });

  const lateThreshold = new Date(event.date);
  lateThreshold.setMinutes(lateThreshold.getMinutes() + 30);

  const lateVendors = await prisma.arrival.findMany({
    where: {
      eventId,
      status: 'not_arrived',
      createdAt: { lt: lateThreshold }
    },
    include: {
      form: {
        include: {
          shop: {
            include: {
              user: true
            }
          }
        }
      }
    }
  });

  return Response.json(lateVendors);
}
```

### Notifications

```typescript
// POST /api/notifications
// Body: { title, message, targetType, targetValue }
export async function POST(request: Request) {
  const body = await request.json();

  // Determine recipients
  let recipients = [];
  if (body.targetType === 'all') {
    recipients = await prisma.user.findMany({ where: { role: 'USER' } });
  } else if (body.targetType === 'event') {
    // Get all vendors for specific event
    recipients = /* complex query */;
  }

  // Create notification for each recipient
  await prisma.notification.createMany({
    data: recipients.map(user => ({
      title: body.title,
      message: body.message,
      userId: user.id,
      createdBy: session.user.id
    }))
  });

  return Response.json({ success: true, count: recipients.length });
}

// GET /api/notifications
export async function GET(request: Request) {
  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' }
  });

  return Response.json(notifications);
}

// PATCH /api/notifications/[id]/read
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  await prisma.notification.update({
    where: { id: params.id },
    data: { isRead: true }
  });

  return Response.json({ success: true });
}
```

---

## Summary

### Total Estimated Time: **30-38 hours**
### Time Actually Spent: **~15-18 hours estimated** (based on current completion)

### Completion Rates (UPDATED 2025-11-03):
- **User/Vendor Side:** Initial 20% → Current **50%** (Target was 75-80%)
- **Staff Side:** Initial 5% → Current **60%** (Target was 70-75%)
- **Admin Side:** Initial 10-15% → Current **45%** (Target was 65-70%)
- **Overall Project:** Initial 15-20% → Current **40%** (Target was 60-70%)

### What IS Actually Functional ✅:
✅ Application submission (all 3 form types)
✅ Application viewing and basic management
✅ Form detail pages for users
✅ Chat & announcements system (real-time)
✅ Direct messaging
✅ Layout/booth assignment with auto-lottery
✅ Staff dashboard
✅ Basic reporting (totals and percentages)
✅ Authentication and role-based access

### What IS Partially Working 🟡:
🟡 Application search and filtering (basic)
🟡 Status management (no automation)
🟡 Vendor list (filters non-functional)
🟡 Basic statistics display
🟡 Event scheduler (date selection only)

### What IS NOT Done ❌:
❌ Event management (uses mock data - CRITICAL!)
❌ Vendor detail pages
❌ Check-in/arrival tracking
❌ Notification system
❌ User account pages (profile, password)
❌ CSV exports
❌ Charts and trend graphs
❌ Staff management
❌ Template management
❌ Incident reporting
❌ Audit log (placeholder only)
❌ Payment processing (Stripe, invoices, receipts) - **Excluded by request**
❌ File uploads (documents, photos) - **Too complex**
❌ HTML emails with tracking - **Too complex**

### Gap Analysis:
- **-20 to -30% behind target** across all areas
- **Most critical gap:** Event management system using mock data instead of database
- **Next critical gaps:** Check-in system, vendor detail pages, user account management

---

**Next Steps Recommended:**
1. Fix event management critical issue (connect to database)
2. Implement vendor detail pages
3. Add user profile and password pages
4. Build check-in/arrival system
5. Implement notification system
