import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework";
import {
  GenerateAuthenticationOptionsOpts,
  generateAuthenticationOptions,
} from "@simplewebauthn/server";
import {
  AuthenticatorTransportFuture,
  Base64URLString,
} from "@simplewebauthn/types";

export async function GET(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const email = req.query.email;
  const query = req.scope.resolve("query");
  const { data: passkeyCredentials } = await query.graph({
    entity: "passkey_credentials",
    fields: [
      "*",
      "auth_identity.*",
      "auth_identity.id",
      "auth_identity.provider_identities.*",
    ],
  });

  const cred = passkeyCredentials.filter(
    (x) => x.auth_identity?.provider_identities[0]?.entity_id == email
  );
  if (!cred || cred.length == 0) {
    res.status(404).send({
      message: "Customer does not exist or does not have a passkey.",
    });
  }

  const opts: GenerateAuthenticationOptionsOpts = {
    timeout: 60000,
    userVerification: "preferred",
    allowCredentials: cred.map((cred) => ({
      id: cred.id as Base64URLString,
      type: "public-key",
      transports: cred.transports as AuthenticatorTransportFuture[],
    })),
    rpID: process.env.RP_ID!,
  };
  const options = await generateAuthenticationOptions(opts);

  req.session.currentChallenge = options.challenge;

  res.send(options);
}
