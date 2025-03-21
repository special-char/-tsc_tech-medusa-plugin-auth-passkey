import { MedusaService } from "@medusajs/framework/utils";
import { PasskeyCredentials } from "../models/passkey-model";

class PasskeyCredentialsModuleService extends MedusaService({
  PasskeyCredentials,
}) {}

export default PasskeyCredentialsModuleService;
