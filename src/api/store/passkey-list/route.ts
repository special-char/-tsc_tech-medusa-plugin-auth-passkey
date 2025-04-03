import {
	AuthenticatedMedusaRequest,
	MedusaResponse,
} from "@medusajs/framework";
import { Modules } from "@medusajs/framework/utils";
import { ICustomerModuleService } from "@medusajs/framework/types";

export async function GET(
	req: AuthenticatedMedusaRequest,
	res: MedusaResponse
): Promise<void> {
	const customerModuleService: ICustomerModuleService = req.scope.resolve(
		Modules.CUSTOMER
	);

	const customer = await customerModuleService.retrieveCustomer(
		req.auth_context.actor_id
	);

	const query = req.scope.resolve("query");
	const { data: passkeyCredentials } = await query.graph({
		entity: "passkey_credentials",
		fields: ["*", "auth_identity.*", "auth_identity.id"],
	});
	const credentials = passkeyCredentials.filter(
		(x) => x?.auth_identity?.id === req.auth_context.auth_identity_id
	);

	res.send(credentials);
}
