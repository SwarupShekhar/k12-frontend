// src/app/student/dashboard/page.tsx
import ProtectedClient from '@/app/components/ProtectedClient';

export default function StudentDashboardPage() {
  return (
    <ProtectedClient roles={['student']}>
      <div className="min-h-screen p-6">
        <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>
        <p>Student dashboard content here</p>
      </div>
    </ProtectedClient>
  );
}

