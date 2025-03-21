import {
	AuthenticatedMedusaRequest,
	MedusaResponse,
} from "@medusajs/framework";
import { Modules } from "@medusajs/framework/utils";
import { ICustomerModuleService } from "@medusajs/framework/types";
import {
	generateRegistrationOptions,
	GenerateRegistrationOptionsOpts,
} from "@simplewebauthn/server";
import {
	AuthenticatorTransportFuture,
	Base64URLString,
} from "@simplewebauthn/types";

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

	const opts: GenerateRegistrationOptionsOpts = {
		rpName: process.env.RP_NAME!,
		rpID: process.env.RP_ID!,
		userName: customer.email,
		timeout: 60000,
		attestationType: "none",
		excludeCredentials: credentials.map((cred) => ({
			id: cred.id as Base64URLString,
			type: "public-key",
			transports: cred.transports as AuthenticatorTransportFuture[],
		})),
		authenticatorSelection: {
			residentKey: "discouraged",
			userVerification: "preferred",
		},
		supportedAlgorithmIDs: [-7, -257],
	};

	const options = await generateRegistrationOptions(opts);

	req.session.currentChallenge = options.challenge;

	res.send(options);
}
