import {
	AuthenticatedMedusaRequest,
	MedusaResponse,
} from "@medusajs/framework";
export async function GET(
	req: AuthenticatedMedusaRequest,
	res: MedusaResponse
): Promise<void> {
	const query = req.scope.resolve("query");
	const { data: passkeyCredentials } = await query.graph({
		entity: "passkey_credentials",
		fields: ["*", "auth_identity.*", "auth_identity.id"],
	});
	const credentials = passkeyCredentials.filter(
		(x) => x?.auth_identity?.id === req.auth_context.auth_identity_id
	);

	res.send({ hasPasskey: credentials.length > 0, message: "success" });
}
