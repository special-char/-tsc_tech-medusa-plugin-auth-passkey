import {
  AuthenticationInput,
  AuthenticationResponse,
  AuthIdentityDTO,
  AuthIdentityProviderService,
} from "@medusajs/framework/types";
import { AbstractAuthModuleProvider } from "@medusajs/framework/utils";
import { Logger } from "@medusajs/framework/types";
import { container } from "@medusajs/framework";
import OtpModuleService from "../../modules/otp/service";
import { OTP_MODULE } from "../../modules/otp";
import { decryptOtp } from "../../utils/otp-encrypt-decrypt";
type InjectedDependencies = {
  logger: Logger;
};

type Options = {
  apiKey: string;
};
function compareOtp(userInputOtp: string, storedHash: string) {
  const decryptedOtp = decryptOtp(storedHash);
  const isMatch = decryptedOtp === userInputOtp;
  return isMatch;
}
async function verifyOtp(phone: string, otp: string) {
  const otpModuleService: OtpModuleService = container.resolve(OTP_MODULE);
  const otpData = await otpModuleService.listOtps({ phone: phone });

  if (!otpData) {
    return { success: false, error: "Invalid phone number" };
  }

  const storedOtp = otpData[0].otp;
  const expiresAt = otpData[0].expires_at;
  const isValid = compareOtp(otp, storedOtp);
  if (!isValid) {
    return { success: false, error: "Incorrect OTP." };
  }

  if (new Date(expiresAt) < new Date()) {
    await otpModuleService.deleteOtps(phone);
    return { success: false, error: "OTP has expired." };
  }

  await otpModuleService.deleteOtps(otpData[0].id);

  return { success: true };
}

class AuthOtpProviderService extends AbstractAuthModuleProvider {
  static identifier = "otp";
  protected logger_: Logger;
  protected options_: Options;

  constructor({ logger }: InjectedDependencies, options: Options) {
    super();
    this.logger_ = logger;
    this.options_ = options;
  }

  async authenticate(
    data: AuthenticationInput,
    authIdentityProviderService: AuthIdentityProviderService
  ): Promise<AuthenticationResponse> {
    if (!data.body?.phone && !data.body?.email) {
      return {
        success: false,
        error: "Phone or email is required",
      };
    }
    const entityId = data.body?.phone
      ? `${data.body.phone}@${
          process.env.PROJECT_NAME || "thespecialcharacter"
        }.com`
      : `${data.body?.email}`;

    const otpCheck = await verifyOtp(entityId, data.body?.otp ?? "");
    if (!otpCheck.success) {
      return otpCheck;
    } else {
      try {
        const query = container.resolve("query");
        const { data: providerIdentity } = await query.graph({
          entity: "provider_identity",
          fields: ["*", "auth_identity.*"],
          filters: {
            entity_id: entityId,
          },
        });

        if (providerIdentity.length > 0) {
          let authIdentity: AuthIdentityDTO = {
            id: providerIdentity[0].auth_identity?.id || "",
            app_metadata: providerIdentity[0].auth_identity.app_metadata || {},
            provider_identities: [
              {
                entity_id: providerIdentity[0].entity_id || "",
                provider: providerIdentity[0].provider || "",
                id: providerIdentity[0].id || "",
                auth_identity: {
                  id: providerIdentity[0].auth_identity?.id || "",
                },
                auth_identity_id: providerIdentity[0].auth_identity?.id || "",
                provider_metadata: providerIdentity[0].provider_metadata || {},
                user_metadata: providerIdentity[0].user_metadata || {},
              },
            ],
          };
          return {
            success: true,
            authIdentity: authIdentity,
          };
        } else {
          const createdAuthIdentity = await authIdentityProviderService.create({
            entity_id: data.body?.phone
              ? `${data.body.phone}@${
                  process.env.PROJECT_NAME || "thespecialcharacter"
                }.com`
              : `${data.body?.email}`,
            provider_metadata: {
              provider: this.provider,
            },
          });
          return {
            success: true,
            authIdentity: createdAuthIdentity,
          };
        }
      } catch (error) {
        return { success: false, error: (error as Error).message };
      }
    }
  }
}

export default AuthOtpProviderService;
