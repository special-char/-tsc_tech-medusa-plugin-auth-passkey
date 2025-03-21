import { model } from "@medusajs/framework/utils";

export const PasskeyCredentials = model.define("passkey-credentials", {
	id: model.id().primaryKey(),
	publicKey: model.text(),
	counter: model.text(),
	transports: model.array().nullable(),
});
