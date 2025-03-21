import { Module } from "@medusajs/framework/utils";
import PasskeyCredentialsModuleService from "./services/passkey-service";

export const PASSKEY_CREDENTIALS_MODULE = "passkeyCredentialsModuleService";

export default Module(PASSKEY_CREDENTIALS_MODULE, {
  service: PasskeyCredentialsModuleService,
});
