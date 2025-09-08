import type { Response, Request, NextFunction } from "express";

class AuthService {
	constructor() {}
	register(req: Request, res: Response, next: NextFunction) {
		return res
			.status(200)
			.json({ message: "success", success: true, data: req.body });
	}
}

export default new AuthService();
