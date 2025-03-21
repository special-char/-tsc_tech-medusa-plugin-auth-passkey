import { ModuleProvider, Modules } from "@medusajs/framework/utils";
import { PassKeyAuthService } from "./services/passkey";

export default ModuleProvider(Modules.AUTH, {
	services: [PassKeyAuthService],
});
