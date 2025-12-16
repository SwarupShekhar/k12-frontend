
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { generateJitsiToken } from '@/app/lib/jitsi';
import { decodeToken } from '@/app/lib/jwt';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://k-12-backend.onrender.com';

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id: sessionId } = await context.params;

    // 1. Extract Auth Token
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
        return NextResponse.json({ message: 'Missing Authorization header' }, { status: 401 });
    }
    const token = authHeader.replace('Bearer ', '');

    // 2. Decode User to get ID/Email
    const decodedUser: any = decodeToken(token);
    if (!decodedUser) {
        return NextResponse.json({ message: 'Invalid token format' }, { status: 401 });
    }

    // Adjust based on your JWT payload structure (sub or userId)
    const userId = decodedUser.sub || decodedUser.userId || decodedUser.id;
    const userEmail = decodedUser.email;
    const userName = decodedUser.name || decodedUser.first_name || 'User';

    if (!userId) {
        return NextResponse.json({ message: 'Invalid token payload' }, { status: 401 });
    }

    try {
        console.log(`[Jitsi Token] Verifying booking access for User: ${userId} (${userEmail}) in Session: ${sessionId}`);

        // 3. Verify Booking Access via Backend
        // We call the backend with the user's token. If they can access the booking, they are a participant.
        const bookingRes = await axios.get(`${API_URL}/bookings/${sessionId}`, {
            headers: { Authorization: authHeader }
        });

        console.log('[Jitsi Token] Backend verification success. Booking:', bookingRes.data?.id);
        const booking = bookingRes.data;

        // 4. Determine Role
        // Check if user is Tutor or Student for this booking
        let isModerator = false;

        // Ensure IDs match. Assuming booking returns objects with ids or just ids.
        const tutorId = booking.tutor_id || booking.tutor?.id;
        const tutorEmail = booking.tutor?.email;

        console.log(`[Jitsi Token] Checking role. UserID: ${userId}, TutorID: ${tutorId}`);
        console.log(`[Jitsi Token] Checking role by Email. UserEmail: ${userEmail}, TutorEmail: ${tutorEmail}`);

        if (tutorId === userId || (tutorEmail && userEmail && tutorEmail === userEmail)) {
            isModerator = true;
            console.log('[Jitsi Token] User verified as MODERATOR.');
        } else {
            console.log('[Jitsi Token] User verified as PARTICIPANT.');
        }

        // 5. Generate Jitsi Token
        const jitsiUser = {
            id: userId,
            name: userName,
            email: userEmail,
            avatar: '',
            moderator: isModerator
        };

        const jitsiToken = generateJitsiToken(jitsiUser, sessionId);
        console.log('[Jitsi Token] Token generated successfully.');

        return NextResponse.json({ token: jitsiToken });

    } catch (error: any) {
        console.error('[Jitsi Token] Error verifying booking:', error.message);
        if (error.response) {
            console.error('[Jitsi Token] Backend Error Data:', error.response.data);
            console.error('[Jitsi Token] Backend Error Status:', error.response.status);

            if (error.response.status === 403 || error.response.status === 401) {
                return NextResponse.json({ message: 'Unauthorized to access this session' }, { status: 403 });
            }
        }

        return NextResponse.json({ message: 'Failed to verify session access', error: error.message }, { status: 500 });
    }
}
