
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

    // Auto-detect algorithm based on key format
    const sanitizedKey = JITSI_SECRET.replace(/\\n/g, '\n');
    const isRSAKey = sanitizedKey.includes('-----BEGIN');
    const algorithm = isRSAKey ? 'RS256' : 'HS256';

    const signOptions: any = { algorithm };
    if (isJaaS && JITSI_KID) {
        signOptions.header = { kid: JITSI_KID };
    }

    try {
        console.log(`[Jitsi Lib] Signing token with ${algorithm}...`);
        return jwt.sign(payload, sanitizedKey, signOptions);
    } catch (e: any) {
        console.error('[Jitsi Lib] Token signing failed:', e.message);
        console.error('[Jitsi Lib] Algorithm:', algorithm, 'IsJaaS:', isJaaS);
        console.error('[Jitsi Lib] Key starts with:', sanitizedKey.substring(0, 50));
        throw e;
    }
}
