export interface Program {
    id: string;
    name: string;
    status: 'draft' | 'active' | 'archived' | 'completed';
    academic: {
        curriculumId: string;
        subjectIds: string[];
        learningGoal: string;
    };
    operational: {
        startDate: string;
        endDate: string;
        sessionsPerWeek: number;
        sessionLengthMinutes: number;
    };
    financial: {
        packageId: string;
        billingType: 'prepaid' | 'postpaid' | 'subscription';
        credits: number;
    };
    staffing: {
        maxStudentsPerTutor: number;
        minimumTutorRating: number;
    };
    delivery: {
        recordingRequired: boolean;
        whiteboardEnabled: boolean;
        parentAccess: boolean;
    };
    reporting: {
        trackAttendance: boolean;
        weeklyReports: boolean;
    };
    // Roster
    students?: { id: string; name: string; enrolledAt: string }[];
    tutors?: { id: string; name: string; subjects: string[]; rating: number }[];

    // Analytics
    studentCount?: number;
    tutorCount?: number;
    sessionsDelivered?: number;
    upcomingSessions?: number;
    hoursUsed?: number;
    creditsUsed?: number;
}
