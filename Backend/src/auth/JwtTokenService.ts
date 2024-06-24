import jwt from 'jsonwebtoken';

interface IJwtTokenService {
    CreateAccessToken(fullName: string, userId: number, userRoles:string): string;
    CreateRefreshToken(userId: number): string;
    TryParseRefreshToken(token: string): boolean;
}

class JwtTokenService implements IJwtTokenService {
    private readonly accessTokenSecret: string;
    private readonly refreshTokenSecret: string;
    private readonly issuer: string;
    private readonly audience: string;

    constructor() {
        this.accessTokenSecret = process.env.ACCESS_TOKEN_SECRET!;
        this.refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET!;
        this.issuer = process.env.JWT_ISSUER!;
        this.audience = process.env.JWT_AUDIENCE!;
    }

    CreateAccessToken(fullName: string, userId: number, role: string): string {
        const payload = {fullName, role};
        return jwt.sign(payload, this.accessTokenSecret, {expiresIn: '1m', subject: userId.toString(),
            issuer: this.issuer, audience: this.audience});
    }
    CreateRefreshToken(userId: number): string {
        const payload = {};
        return jwt.sign(payload, this.refreshTokenSecret, {expiresIn: '7d',
            subject: userId.toString(), issuer: this.issuer, audience: this.audience});
    }
    TryParseRefreshToken(token: string): boolean {
        try {
            jwt.verify(token, this.refreshTokenSecret);
            return true;
        } catch (error) {
            return false;
        }
    }

    GetUserIdFromRefreshToken(token: string): number | undefined {
        const subject = jwt.verify(token, this.refreshTokenSecret).sub
        if (typeof(subject) === 'string') {
            return parseInt(subject);
        }
        return undefined;
    }

    GetUserIdFromAccessToken(token: string): number | undefined {
        const subject = jwt.verify(token, this.accessTokenSecret).sub
        if (typeof(subject) === 'string') {
            return parseInt(subject);
        }
        return undefined;
    }
}

export default JwtTokenService;