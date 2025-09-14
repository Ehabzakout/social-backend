import bcrypt from "bcryptjs";
export async function hashText(text: string) {
	return await bcrypt.hash(text, 10);
}

export async function compareText(text: string, hashText: string) {
	return await bcrypt.compare(text, hashText);
}
