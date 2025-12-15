# Backend Implementation Guide - Session Features

Complete implementation guide for adding session chat and recording features to the K12 backend (NestJS).

---

## 1. Prisma Schema Updates

Add to `prisma/schema.prisma`:

```prisma
model SessionMessage {
  id         String   @id @default(uuid())
  session_id String   // References bookings.id
  user_id    String   // References users.id
  text       String
  created_at DateTime @default(now())

  booking Booking @relation(fields: [session_id], references: [id], onDelete: Cascade)
  user    User    @relation(fields: [user_id], references: [id])

  @@map("session_messages")
}

model SessionRecording {
  id               String   @id @default(uuid())
  session_id       String
  uploaded_by      String
  file_url         String
  file_size_bytes  Int?
  duration_seconds Int?
  created_at       DateTime @default(now())

  booking  Booking @relation(fields: [session_id], references: [id], onDelete: Cascade)
  uploader User    @relation(fields: [uploaded_by], references: [id])

  @@map("session_recordings")
}

// Update existing models to add relations
model Booking {
  // ... existing fields ...
  messages   SessionMessage[]
  recordings SessionRecording[]
}

model User {
  // ... existing fields ...
  session_messages   SessionMessage[]
  session_recordings SessionRecording[]
}
```

Run migrations:
```bash
npx prisma migrate dev --name add_session_features
```

---

## 2. Create Sessions Module

### `src/sessions/sessions.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SessionsController],
  providers: [SessionsService],
})
export class SessionsModule {}
```

### `src/sessions/sessions.service.ts`

```typescript
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SessionsService {
  constructor(private prisma: PrismaService) {}

  // ==================== MESSAGES ====================

  async getMessages(sessionId: string, userId: string) {
    // Verify user has access to this session
    const booking = await this.prisma.booking.findUnique({
      where: { id: sessionId },
      include: { student: true },
    });

    if (!booking) {
      throw new NotFoundException('Session not found');
    }

    // Check if user is the parent, student, or assigned tutor
    const isParent = booking.parent_id === userId;
    const isStudent = booking.student?.parent_id === userId;
    const isTutor = booking.tutor_id === userId;

    if (!isParent && !isStudent && !isTutor) {
      throw new ForbiddenException('Access denied to this session');
    }

    const messages = await this.prisma.sessionMessage.findMany({
      where: { session_id: sessionId },
      include: {
        user: {
          select: { first_name: true, last_name: true },
        },
      },
      orderBy: { created_at: 'asc' },
    });

    return messages.map((m) => ({
      id: m.id,
      from: `${m.user.first_name} ${m.user.last_name || ''}`.trim(),
      text: m.text,
      created_at: m.created_at,
    }));
  }

  async sendMessage(sessionId: string, userId: string, text: string) {
    // Verify user has access
    const booking = await this.prisma.booking.findUnique({
      where: { id: sessionId },
      include: { student: true },
    });

    if (!booking) {
      throw new NotFoundException('Session not found');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    const message = await this.prisma.sessionMessage.create({
      data: {
        session_id: sessionId,
        user_id: userId,
        text,
      },
      include: {
        user: {
          select: { first_name: true, last_name: true },
        },
      },
    });

    return {
      id: message.id,
      from: `${message.user.first_name} ${message.user.last_name || ''}`.trim(),
      text: message.text,
      created_at: message.created_at,
    };
  }

  // ==================== RECORDINGS ====================

  async getRecordings(sessionId: string, userId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: sessionId },
    });

    if (!booking) {
      throw new NotFoundException('Session not found');
    }

    return this.prisma.sessionRecording.findMany({
      where: { session_id: sessionId },
      orderBy: { created_at: 'desc' },
    });
  }

  async uploadRecording(
    sessionId: string,
    userId: string,
    fileUrl: string,
    fileSize?: number,
    duration?: number,
  ) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: sessionId },
    });

    if (!booking) {
      throw new NotFoundException('Session not found');
    }

    // Only tutor can upload recordings
    if (booking.tutor_id !== userId) {
      throw new ForbiddenException('Only the tutor can upload recordings');
    }

    return this.prisma.sessionRecording.create({
      data: {
        session_id: sessionId,
        uploaded_by: userId,
        file_url: fileUrl,
        file_size_bytes: fileSize,
        duration_seconds: duration,
      },
    });
  }
}
```

### `src/sessions/sessions.controller.ts`

```typescript
import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SessionsService } from './sessions.service';

@Controller('sessions')
@UseGuards(JwtAuthGuard)
export class SessionsController {
  constructor(private sessionsService: SessionsService) {}

  // ==================== MESSAGES ====================

  @Get(':id/messages')
  async getMessages(@Param('id') sessionId: string, @Req() req: any) {
    return this.sessionsService.getMessages(sessionId, req.user.id);
  }

  @Post(':id/messages')
  async sendMessage(
    @Param('id') sessionId: string,
    @Body() body: { text: string },
    @Req() req: any,
  ) {
    return this.sessionsService.sendMessage(sessionId, req.user.id, body.text);
  }

  // ==================== RECORDINGS ====================

  @Get(':id/recordings')
  async getRecordings(@Param('id') sessionId: string, @Req() req: any) {
    return this.sessionsService.getRecordings(sessionId, req.user.id);
  }

  @Post(':id/recordings')
  @UseInterceptors(FileInterceptor('file'))
  async uploadRecording(
    @Param('id') sessionId: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    // TODO: Upload file to S3/Cloudinary and get URL
    // For now, save locally or implement your storage solution
    const fileUrl = `/uploads/recordings/${file.originalname}`;
    
    return this.sessionsService.uploadRecording(
      sessionId,
      req.user.id,
      fileUrl,
      file.size,
    );
  }
}
```

### `src/sessions/dto/send-message.dto.ts`

```typescript
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class SendMessageDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  text: string;
}
```

---

## 3. Real-time Chat (WebSockets) [RECOMMENDED]

For a better user experience (instant messages without refreshing), implement a WebSocket Gateway.

### Install Dependencies
```bash
npm install @nestjs/websockets @nestjs/platform-socket.io socket.io
```

### `src/sessions/sessions.gateway.ts`

```typescript
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SessionsService } from './sessions.service';
import { UseGuards } from '@nestjs/common';
import { WsJwtGuard } from '../auth/ws-jwt.guard'; // Assume you have a WS JWT Guard

@WebSocketGateway({
  cors: {
    origin: '*', // Configure this for your frontend URL
  },
  namespace: 'encounters',
})
export class SessionsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private sessionsService: SessionsService) {}

  handleConnection(client: Socket) {
    // console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    // console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('joinSession')
  handleJoinSession(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { sessionId: string },
  ) {
    client.join(`session-${data.sessionId}`);
    // console.log(`Client ${client.id} joined session-${data.sessionId}`);
  }

  @SubscribeMessage('leaveSession')
  handleLeaveSession(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { sessionId: string },
  ) {
    client.leave(`session-${data.sessionId}`);
  }

  // Call this from SessionService.sendMessage usually, but here is a direct handler example
  // OR just listen to database changes/events if decoupled.
  // For simplicity, we'll let the Controller handle logic and just emit events?
  // BETTER PATTERN: Controller -> Service -> Gateway.emit()
}
```

### Update `SessionsService` to emit events

Add `SessionsGateway` to `SessionsModule` providers and inject it into `SessionsService` to emit events when a message is created.

```typescript
// sessions.service.ts
// ...
import { SessionsGateway } from './sessions.gateway';

@Injectable()
export class SessionsService {
  constructor(
    private prisma: PrismaService,
    // Use forwardRef or @Inject if circular dependency issues arise, 
    // but usually Gateway depends on Service. 
    // If Service needs to emit, better to use EventEmitter or a shared Subject.
  ) {}
  
  // ... sendMessage logic ...
  // After saving to DB:
  // this.server.to(`session-${sessionId}`).emit('newMessage', messageDto);
}
```

---

## 4. Register Module

Update `src/app.module.ts`:

```typescript
import { SessionsModule } from './sessions/sessions.module';

@Module({
  imports: [
    // ... existing imports
    SessionsModule,
  ],
})
export class AppModule {}
```

---

## 4. File Upload Setup (for recordings)

Install multer:
```bash
npm install @nestjs/platform-express multer
npm install -D @types/multer
```

For production, integrate with S3 or Cloudinary:

```typescript
// Example S3 upload helper
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

async function uploadToS3(file: Express.Multer.File): Promise<string> {
  const s3 = new S3Client({ region: process.env.AWS_REGION });
  const key = `recordings/${Date.now()}-${file.originalname}`;
  
  await s3.send(new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  }));
  
  return `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${key}`;
}
```

---

## 5. API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/sessions/:id/messages` | Get all chat messages |
| POST | `/sessions/:id/messages` | Send a chat message |
| GET | `/sessions/:id/recordings` | List recordings |
| POST | `/sessions/:id/recordings` | Upload a recording |

---

## 6. Testing

```bash
# Get messages
curl -H "Authorization: Bearer <token>" \
  http://localhost:3000/sessions/<session-id>/messages

# Send message
curl -X POST -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello!"}' \
  http://localhost:3000/sessions/<session-id>/messages
```

---

## Quick Start Checklist

1. [ ] Add models to `schema.prisma`
2. [ ] Run `npx prisma migrate dev`
3. [ ] Create `src/sessions/` folder
4. [ ] Add `sessions.module.ts`
5. [ ] Add `sessions.service.ts`
6. [ ] Add `sessions.controller.ts`
7. [ ] Register in `app.module.ts`
8. [ ] Test endpoints with curl
9. [ ] (Optional) Set up S3/Cloudinary for recordings

---

## 7. Admin Dashboard Features

The new Admin Dashboard requires the following endpoints to support enhanced KPIs, student lists, and tutor allocation.

### `src/admin/admin.controller.ts`

```typescript
// ... existing admin controller ...

@Get('stats')
async getStats() {
  // Update to include 'tutors' count
  return {
    students: await this.prisma.student.count(),
    parents: await this.prisma.user.count({ where: { role: 'parent' } }),
    tutors: await this.prisma.user.count({ where: { role: 'tutor' } }), // NEW
    upcomingSessions: await this.prisma.booking.count({ ... }),
  };
}

@Get('students')
async getStudents() {
  // List all students with parent info
  return this.prisma.student.findMany({
    include: { parent: { select: { email: true } } }
  });
}

@Get('tutors')
async getTutors() {
  // List all tutors including their subjects
  // Ensure 'subjects' field in User model or related table is queried
  return this.prisma.user.findMany({
    where: { role: 'tutor' },
    select: { id: true, first_name: true, last_name: true, subjects: true }
  });
}

@Post('allocations')
async allocateTutor(@Body() body: { studentId: string, tutorId: string, subjectId: string }) {
  // 1. Verify availability (optional initially)
  // 2. Create specific matchmaking record or Booking template
  // 3. Notify Tutor
  return { success: true, message: 'Tutor assigned' };
}
```
