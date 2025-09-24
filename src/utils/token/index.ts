import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import envConfig from "../../config/env/env-config";

const secretKey = envConfig.JWT_SECRET as string;
export function generateToken({
	data,
	secret = secretKey,
	options,
}: {
	data: { id: string; name: string; role: string };
	secret?: string;
	options?: SignOptions;
}) {
	return jwt.sign(data, secret, options);
}

export function verifyToken(token: string, secret: string = secretKey) {
	const payload = jwt.verify(token, secret);
	return payload as JwtPayload;
}
