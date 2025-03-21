import crypto from "crypto";

const algorithm = "aes-256-cbc";
const key = crypto.randomBytes(32); // Use a secure key management strategy in production
const iv = crypto.randomBytes(16); // Initialization vector

export function encryptOtp(otp: string): string {
	const cipher = crypto.createCipheriv(algorithm, key, iv);
	let encrypted = cipher.update(otp, "utf8", "hex");
	encrypted += cipher.final("hex");
	return `${iv.toString("hex")}:${encrypted}`; // Prepend IV for decryption
}

export function decryptOtp(encryptedOtp: string): string {
	const [ivHex, encrypted] = encryptedOtp.split(":");
	const decipher = crypto.createDecipheriv(
		algorithm,
		key,
		Buffer.from(ivHex, "hex")
	);
	let decrypted = decipher.update(encrypted, "hex", "utf8");
	decrypted += decipher.final("utf8");
	return decrypted;
}
