import jwt from "jsonwebtoken";

const secretKey = process.env.JWT_SECRET as string;
export function generateToken(
	data: { id: string; name: string },
	secret: string = secretKey
) {
	return jwt.sign(data, secret);
}

export function verifyToken(token: string, secret: string = secretKey) {
	const payload = jwt.verify(token, secret);
	if (
		typeof payload === "string" ||
		!payload ||
		!("id" in payload) ||
		!("name" in payload)
	) {
		throw new Error("Invalid token payload");
	}
	return payload as { id: string; name: string };
}
