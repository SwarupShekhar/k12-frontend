# Tutor Dashboard Fix - Backend Requirements

## Problem
After allocating a tutor via the admin panel (`POST /admin/allocations`), the tutor dashboard remains empty because:
1. The allocation doesn't update the booking's `tutor_id` field
2. There's no `/tutor/bookings` endpoint for tutors to fetch their assigned sessions

## Required Backend Changes

### 1. Update Admin Allocation Logic

**File**: `src/admin/admin.service.ts` (or wherever `POST /admin/allocations` is handled)

**Current behavior**: Creates an allocation record but doesn't link it to bookings

**Required fix**:
```typescript
@Post('allocations')
async allocateTutor(@Body() body: { studentId: string, tutorId: string, subjectId: string }) {
  // Find the booking that matches this student + subject
  const booking = await this.prisma.booking.findFirst({
    where: {
      student_id: body.studentId,
      subject_id: body.subjectId,
      tutor_id: null, // Only unclaimed bookings
      status: 'pending' // or whatever status indicates unassigned
    },
    orderBy: { created_at: 'desc' } // Get the most recent
  });

  if (!booking) {
    throw new NotFoundException('No matching booking found for this student and subject');
  }

  // Update the booking with the tutor
  await this.prisma.booking.update({
    where: { id: booking.id },
    data: {
      tutor_id: body.tutorId,
      status: 'confirmed' // Update status to confirmed
    }
  });

  // Optional: Send email notification to tutor
  // await this.emailService.notifyTutorAssignment(body.tutorId, booking.id);

  return { success: true, message: 'Tutor assigned successfully', bookingId: booking.id };
}
```

### 2. Create Tutor Bookings Endpoint

**File**: `src/bookings/bookings.controller.ts` (or create `src/tutor/tutor.controller.ts`)

Add this endpoint:

```typescript
@Get('tutor/bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('tutor')
async getTutorBookings(@Req() req: any) {
  const tutorId = req.user.userId; // or req.user.id depending on your JWT payload

  const bookings = await this.prisma.booking.findMany({
    where: {
      tutor_id: tutorId,
      status: { in: ['confirmed', 'scheduled'] } // Exclude cancelled
    },
    include: {
      student: {
        select: {
          id: true,
          first_name: true,
          last_name: true
        }
      },
      subject: {
        select: {
          id: true,
          name: true
        }
      }
    },
    orderBy: { start_time: 'asc' }
  });

  // Transform to match frontend expectations
  return bookings.map(b => ({
    id: b.id,
    start_time: b.start_time,
    end_time: b.end_time,
    date: b.start_time, // Alias for compatibility
    status: b.status,
    subject_name: b.subject?.name || 'Unknown Subject',
    child_name: `${b.student.first_name} ${b.student.last_name}`,
    student_id: b.student.id,
    note: b.note
  }));
}
```

### 3. Update Booking Schema (if needed)

Ensure your `Booking` model has a `tutor_id` field:

```prisma
model Booking {
  id            String   @id @default(uuid())
  parent_id     String
  student_id    String
  tutor_id      String?  // <-- Make sure this exists (nullable)
  subject_id    String
  curriculum_id String
  package_id    String
  status        String   @default("pending")
  start_time    DateTime
  end_time      DateTime
  note          String?
  created_at    DateTime @default(now())

  parent     User    @relation("ParentBookings", fields: [parent_id], references: [id])
  student    Student @relation(fields: [student_id], references: [id])
  tutor      User?   @relation("TutorBookings", fields: [tutor_id], references: [id])
  subject    Subject @relation(fields: [subject_id], references: [id])
  curriculum Curriculum @relation(fields: [curriculum_id], references: [id])
  package    Package @relation(fields: [package_id], references: [id])

  @@map("bookings")
}
```

If you need to add the field, run:
```bash
npx prisma migrate dev --name add_tutor_to_bookings
```

### 4. Optional: Available Jobs Endpoint

**File**: `src/bookings/bookings.controller.ts`

This endpoint shows unclaimed bookings matching the tutor's subjects:

```typescript
@Get('bookings/available')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('tutor')
async getAvailableJobs(@Req() req: any) {
  const tutorId = req.user.userId;

  // Get tutor's subjects
  const tutor = await this.prisma.user.findUnique({
    where: { id: tutorId },
    select: { subjects: true } // Assuming subjects is an array field
  });

  if (!tutor || !tutor.subjects || tutor.subjects.length === 0) {
    return [];
  }

  // Find unclaimed bookings matching tutor's subjects
  const availableBookings = await this.prisma.booking.findMany({
    where: {
      tutor_id: null,
      subject_id: { in: tutor.subjects },
      status: 'pending',
      start_time: { gte: new Date() } // Only future sessions
    },
    include: {
      student: { select: { first_name: true, last_name: true } },
      subject: { select: { name: true } }
    },
    orderBy: { start_time: 'asc' },
    take: 20 // Limit results
  });

  return availableBookings.map(b => ({
    id: b.id,
    subject_name: b.subject?.name,
    requested_start: b.start_time,
    student_name: `${b.student.first_name} ${b.student.last_name}`
  }));
}
```

## Testing

After implementing these changes:

1. **Allocate a tutor** via admin panel
2. **Log in as that tutor**
3. **Visit `/tutor/dashboard`**
4. **Verify** the session appears in "Today's Classes" or "Confirmed & Upcoming"
5. **Click "Start Class"** to join the session at `/session/[id]`

## Summary

- ✅ Frontend is already correct (fetches from `/tutor/bookings`)
- ❌ Backend needs `GET /tutor/bookings` endpoint
- ❌ Backend needs to update `booking.tutor_id` when allocating
- ❌ Optional: Add `GET /bookings/available` for claim-based workflow
