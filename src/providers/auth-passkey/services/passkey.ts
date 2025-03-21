import {
  AuthenticationResponse,
  AuthIdentityDTO,
  AuthIdentityProviderService,
  EmailPassAuthProviderOptions,
  Logger,
} from "@medusajs/framework/types";
import {
  AbstractAuthModuleProvider,
  isString,
  MedusaError,
  Modules,
} from "@medusajs/framework/utils";
import {
  AuthenticatorTransportFuture,
  Base64URLString,
  VerifiedRegistrationResponse,
  verifyAuthenticationResponse,
  VerifyAuthenticationResponseOpts,
  verifyRegistrationResponse,
  VerifyRegistrationResponseOpts,
} from "@simplewebauthn/server";
import PasskeyCredentialsModuleService from "../../../modules/passkey-credentials/services/passkey-service";
import { DAL } from "@medusajs/framework/types";
import { PASSKEY_CREDENTIALS_MODULE } from "../../../modules/passkey-credentials";
import { container } from "@medusajs/framework";
// import { ProviderIdentity } from ".medusa/types/remote-query-entry-points";

type InjectedDependencies = {
  logger: Logger;
  baseRepository: DAL.RepositoryService;
};

interface LocalServiceConfig extends EmailPassAuthProviderOptions {
  rpID: string;
  rpName: string;
  enableHTTPS: string;
  expectedOrigin: string;
}

export class PassKeyAuthService extends AbstractAuthModuleProvider {
  static identifier = "auth";
  static DISPLAY_NAME = "Passkey Authentication";

  protected config_: LocalServiceConfig;
  protected logger_: Logger;
  protected passkeyCredentialsModuleService_: PasskeyCredentialsModuleService =
    container.resolve(PASSKEY_CREDENTIALS_MODULE);
  protected baseRepository_: DAL.RepositoryService;

  constructor(
    { logger, baseRepository }: InjectedDependencies,
    options: LocalServiceConfig
  ) {
    // @ts-ignore
    super(...arguments);
    this.config_ = options;
    this.logger_ = logger;
    this.baseRepository_ = baseRepository;
    this.config_["expectedOrigin"] = options.enableHTTPS
      ? `https://${options.rpID}`
      : `http://localhost:${process.env.PORT}`;
  }

  async authenticate(
    userData: any,
    authIdentityService: AuthIdentityProviderService
  ): Promise<AuthenticationResponse> {
    const { email, expectedChallenge, rest } =
      JSON.parse(JSON.stringify(userData.body)) ?? {};
    if (!email || !isString(email)) {
      return {
        success: false,
        error: "Email should be a string",
      };
    }

    let authIdentity: AuthIdentityDTO | undefined;

    let verification: VerifiedRegistrationResponse;
    const query = container.resolve("query");
    try {
      const { data: providerIdentity } = await query.graph({
        entity: "provider_identity",
        fields: ["*", "auth_identity.*"],
        filters: {
          entity_id: email,
        },
      });
      if (providerIdentity && providerIdentity.length > 0) {
        const providerIds = providerIdentity[0].auth_identity?.id;
        const { data: passkeyCredentials } = await query.graph({
          entity: "passkey_credentials",
          fields: ["*", "auth_identity.*", "auth_identity.id"],
        });
        const credentials = passkeyCredentials.filter(
          (x) => providerIds == x?.auth_identity?.id && x.id == rest.id
        );
        if (credentials && credentials.length != 0) {
          try {
            const opts: VerifyAuthenticationResponseOpts = {
              response: rest,
              expectedChallenge: expectedChallenge,
              expectedOrigin:
                process.env.FRONTEND_URL || "http://localhost:3000",
              expectedRPID: this.config_.rpID,
              credential: {
                id: credentials[0].id as Base64URLString,
                publicKey: Buffer.from(credentials[0].publicKey, "base64"),
                counter: parseInt(credentials[0].counter),
                transports: credentials[0]
                  .transports as AuthenticatorTransportFuture[],
              },
            };

            verification = await verifyAuthenticationResponse(opts);
          } catch (error) {
            const _error = error as Error;
            console.error(_error);
            return { success: false, error: error.message };
          }
          const { verified } = verification;

          if (verified) {
            let appMetaData =
              providerIdentity[0].auth_identity.app_metadata || {};
            if (appMetaData && Object.keys(appMetaData).length === 0) {
              const { data: customer } = await query.graph<any>({
                entity: "customer",
                fields: ["*"],
                filters: {
                  email: email as string,
                },
              });
              if (customer && customer.length > 0) {
                appMetaData = { customer_id: customer[0].id };
              }
            }
            authIdentity = {
              id: providerIdentity[0].auth_identity?.id || "",
              app_metadata: appMetaData,
              provider_identities: [
                {
                  entity_id: providerIdentity[0].entity_id || "",
                  provider: providerIdentity[0].provider || "",
                  id: providerIdentity[0].id || "",
                  auth_identity: {
                    id: providerIdentity[0].auth_identity?.id || "",
                  },
                  auth_identity_id: providerIdentity[0].auth_identity?.id || "",
                  provider_metadata: {},
                  user_metadata: {},
                },
              ],
            };

            return {
              success: true,
              authIdentity,
            };
          }
        }
      }
      return {
        success: false,
        error: "Device not registered",
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async register(
    userData: any,
    authIdentityService: AuthIdentityProviderService
  ): Promise<AuthenticationResponse> {
    const query = container.resolve("query");
    const { email, expectedChallenge, rest } =
      JSON.parse(JSON.stringify(userData.body)) ?? {};
    if (!email || !isString(email)) {
      return {
        success: false,
        error: "Email should be a string",
      };
    }

    try {
      const { data: providerIdentity } = await query.graph({
        entity: "provider_identity",
        fields: ["*", "auth_identity.*"],
        filters: {
          entity_id: email,
        },
      });
      console.log("providerIdentity", providerIdentity);

      if (providerIdentity && providerIdentity.length > 0) {
        const createAuthIdentityResponse = await this.createAuthIdentity(
          rest,
          expectedChallenge,
          this.config_,
          undefined,
          providerIdentity[0]
        );
        console.log("createAuthIdentityResponse", createAuthIdentityResponse);

        return createAuthIdentityResponse;
      } else {
        const authIdentity = await authIdentityService.create({
          entity_id: email,
        });
        const createAuthIdentityResponse = await this.createAuthIdentity(
          rest,
          expectedChallenge,
          this.config_,
          authIdentity,
          undefined
        );
        console.log(
          "createAuthIdentityResponse else",
          createAuthIdentityResponse
        );

        return createAuthIdentityResponse;
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  protected createAuthIdentity = async (
    rest: any,
    expectedChallenge: string,
    config: any,
    authIdentity?: AuthIdentityDTO,
    providerIdentity?: any
  ): Promise<AuthenticationResponse> => {
    let verification: VerifiedRegistrationResponse;
    const opts: VerifyRegistrationResponseOpts = {
      response: rest,
      expectedChallenge: expectedChallenge,
      expectedOrigin: process.env.FRONTEND_URL || "http://localhost:3000",
      expectedRPID: this.config_.rpID,
      requireUserVerification: false,
    };
    verification = await verifyRegistrationResponse(opts);
    const { verified, registrationInfo } = verification;
    if (verified && registrationInfo) {
      const { credential } = registrationInfo;
      const existingCredential =
        await this.passkeyCredentialsModuleService_.listPasskeyCredentials({
          id: credential.id,
        });
      if (!existingCredential || existingCredential.length === 0) {
        const passKeyCredentials =
          await this.passkeyCredentialsModuleService_.createPasskeyCredentials({
            id: credential.id,
            publicKey: Buffer.from(credential.publicKey).toString("base64"),
            counter: credential.counter,
            transports: rest.response.transports,
          });
        const remoteLink = container.resolve("remoteLink");

        await remoteLink.create([
          {
            [Modules.AUTH]: {
              auth_identity_id: authIdentity
                ? authIdentity.id
                : providerIdentity?.auth_identity?.id,
            },
            ["passkeyCredentialsModuleService"]: {
              passkey_credentials_id: passKeyCredentials.id,
            },
          },
        ]);
        let dummy: AuthIdentityDTO = {
          id: providerIdentity?.auth_identity?.id || "",
          app_metadata: providerIdentity?.auth_identity?.app_metadata || {},
          provider_identities: [
            {
              entity_id: providerIdentity?.entity_id || "",
              provider: providerIdentity?.provider || "",
              id: providerIdentity?.id || "",
              auth_identity: {
                id: providerIdentity?.auth_identity?.id || "",
              },
              auth_identity_id: providerIdentity?.auth_identity?.id || "",
              provider_metadata: {},
              user_metadata: {},
            },
          ],
        };
        return {
          success: true,
          authIdentity: authIdentity ? authIdentity : dummy,
        };
      }
    }
    return {
      success: false,
      error: "Device not registered",
    };
  };
}
