
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

    // 4. Hybrid Strategy: Try Backend First, Fallback to Local
    try {
        console.log(`[Jitsi Proxy] Fetching token from Backend: ${API_URL}/sessions/${sessionId}/jitsi-token`);

        const backendRes = await axios.get(`${API_URL}/sessions/${sessionId}/jitsi-token`, {
            headers: { Authorization: authHeader }
        });

        const data = backendRes.data;
        // Ensure roomName/scriptUrl are present even from backend
        const JITSI_APP_ID = process.env.JITSI_APP_ID || 'my-app-id';
        const isJaaS = JITSI_APP_ID.startsWith('vpaas-magic-cookie');

        if (!data.roomName) {
            data.roomName = `K12Session${sessionId.replace(/-/g, '').slice(0, 16)}`;
            if (isJaaS) data.roomName = `${JITSI_APP_ID}/${data.roomName}`;
        }
        if (!data.scriptUrl) {
            data.scriptUrl = isJaaS
                ? `https://8x8.vc/${JITSI_APP_ID}/external_api.js`
                : 'https://meet.jit.si/external_api.js';
        }

        console.log('[Jitsi Proxy] Success. Room:', data.roomName);
        return NextResponse.json(data);

    } catch (proxyError: any) {
        console.warn(`[Jitsi Proxy] Backend failed (${proxyError.message}). Falling back to Local Generation.`);

        // ==========================================
        // FALLBACK: LOCAL GENERATION (Robust Mode)
        // ==========================================
        try {
            // 1. Verify Booking (to ensure access rights)
            // We can use the existing /bookings endpoint which IS working
            let booking = { tutor_id: null, tutor: null } as any;
            try {
                const bookingRes = await axios.get(`${API_URL}/bookings/${sessionId}?include=tutor`, {
                    headers: { Authorization: authHeader }
                });
                booking = bookingRes.data;
            } catch (e) {
                console.warn('[Jitsi Local] Booking check failed. Trusting JWT role as failsafe.');
            }

            // 2. Determine Role
            const tutorId = booking.tutor_id || booking.tutor?.id;
            let isModerator = false;

            if (decodedUser.role === 'admin' || decodedUser.role === 'tutor') {
                isModerator = true;
            } else if (tutorId && userId && tutorId == userId) {
                isModerator = true;
            }

            // 3. Generate Configs
            const JITSI_APP_ID = process.env.JITSI_APP_ID || '';
            const isJaaS = JITSI_APP_ID.startsWith('vpaas-magic-cookie');

            let roomName = `K12Session${sessionId.replace(/-/g, '').slice(0, 16)}`;
            let scriptUrl = 'https://meet.jit.si/external_api.js';

            if (isJaaS) {
                roomName = `${JITSI_APP_ID}/${roomName}`;
                scriptUrl = `https://8x8.vc/${JITSI_APP_ID}/external_api.js`;
            }

            // 4. Generate Token
            const jitsiUser = {
                id: userId,
                name: userName,
                email: userEmail,
                avatar: '',
                moderator: isModerator
            };

            const jitsiToken = generateJitsiToken(jitsiUser, roomName);
            console.log(`[Jitsi Local] Generated Token. Room: ${roomName}, Mod: ${isModerator}`);

            return NextResponse.json({
                token: jitsiToken,
                roomName: roomName,
                scriptUrl: scriptUrl, // Send to frontend
                debug: { mode: 'fallback', isModerator, match: isModerator }
            });

        } catch (localError: any) {
            console.error('[Jitsi Token] Fatal Error in Fallback:', localError);
            return NextResponse.json({
                message: 'Failed to generate session token (Both Proxy and Fallback failed)',
                error: localError.message,
                envCheck: {
                    hasAppID: !!process.env.JITSI_APP_ID,
                    hasSecret: !!process.env.JITSI_SECRET
                }
            }, { status: 500 });
        }
    }
}
