import bcrypt from "bcryptjs";
export function hash(text: string) {
	return bcrypt.hashSync(text);
}

export function compareText(text: string, hashText: string) {
	return bcrypt.compareSync(text, hashText);
}
