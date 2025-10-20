export enum SYS_ROLE {
	user = "user",
	admin = "admin",
	superAdmin = "superAdmin",
}

export enum GENDER {
	male = "male",
	female = "female",
}

export enum USER_AGENT {
	local = "local",
	google = "google",
}

export enum REACTION {
	like,
	love,
	angry,
}
export enum REQUEST_STATUS {
	"pending" = "pending",
	"canceled" = "canceled",
	"accepted" = "accepted",
	"rejected" = "rejected",
}

export enum REQUEST_TYPE {
	"friend" = "friend",
	"unfriend" = "unfriend",
	"block" = "block",
}
