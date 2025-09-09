export function generateOtp() {
	return Math.floor(Math.random() * 90000 + 10000) as unknown as string;
}

export function expiryTime(time: number = 5 * 60 * 1000) {
	return (Date.now() + time) as unknown as Date;
}
