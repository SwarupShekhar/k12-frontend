
import jwt from 'jsonwebtoken';

interface JitsiUser {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    moderator: boolean;
}

export function generateJitsiToken(user: JitsiUser, room: string) {
    // START: Environment variables
    // In a real app, these must be in .env
    // For local dev/test without a JaaS account, we use flexible defaults
    // If using JaaS, JITSI_APP_ID should be the "kid" or AppID
    const JITSI_APP_ID = process.env.JITSI_APP_ID || 'my-app-id';

    // SUPPORT BOTH NAMING CONVENTIONS
    const JITSI_SECRET = process.env.JITSI_SECRET || process.env.JITSI_APP_SECRET || 'my-secret-key';

    if (JITSI_SECRET === 'my-secret-key') {
        console.warn('[Jitsi lib] WARNING: Using default unsafe secret. Token will likely be rejected by Jitsi server unless testing.');
    } else {
        console.log('[Jitsi lib] Using configured Jitsi Secret.');
    }

    const JITSI_DOMAIN = process.env.JITSI_DOMAIN || 'meet.jit.si';
    // END: Environment variables

    const now = Math.floor(Date.now() / 1000);
    const exp = now + 7200; // 2 hours
    const nbf = now - 10;

    const payload = {
        context: {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                moderator: user.moderator ? true : false
            },
            features: {
                recording: user.moderator ? true : false,
                livestreaming: user.moderator ? true : false,
                transcription: user.moderator ? true : false,
                "screen-sharing": true
            }
        },
        aud: 'jitsi',
        iss: JITSI_APP_ID,
        sub: JITSI_DOMAIN,
        room: room,
        exp: exp,
        nbf: nbf
    };

    return jwt.sign(payload, JITSI_SECRET);
}
