import jwt, { SignOptions } from "jsonwebtoken";

const SECRET: string = process.env.JWT_SECRET || "supersecretkey"; // Store securely in .env

export const signJwt = (
    payload: object,
    expiresIn: string | number = "7d"
): string => {
    return jwt.sign(payload, SECRET, { expiresIn } as SignOptions);
};

export const verifyJwt = <T>(token: string): T | null => {
    try {
        return jwt.verify(token, SECRET) as T;
    } catch {
        return null;
    }
};
