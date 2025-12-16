
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
    const JITSI_KID = process.env.JITSI_KID; // Key ID for JaaS
    // END: Environment variables

    const now = Math.floor(Date.now() / 1000);
    const exp = now + 7200; // 2 hours
    const nbf = now - 10;

    const isJaaS = JITSI_APP_ID.startsWith('vpaas-magic-cookie');

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
        iss: isJaaS ? 'chat' : JITSI_APP_ID,
        sub: isJaaS ? JITSI_APP_ID : JITSI_DOMAIN,
        room: room,
        exp: exp,
        nbf: nbf
    };

    const signOptions: any = { algorithm: 'RS256' };
    if (isJaaS && JITSI_KID) {
        signOptions.header = { kid: JITSI_KID };
    }

    try {
        // Sanitize the key: Vercel/Render env vars often escape newlines
        const privateKey = JITSI_SECRET.replace(/\\n/g, '\n');

        console.log('[Jitsi Lib] Signing token...');
        return jwt.sign(payload, privateKey, signOptions);
    } catch (e: any) {
        console.error('[Jitsi Lib] Token signing failed:', e.message);
        throw e;
    }
}
