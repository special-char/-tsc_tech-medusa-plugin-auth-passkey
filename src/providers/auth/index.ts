import { ModuleProvider, Modules } from "@medusajs/framework/utils";
import AuthOtpProviderService from "./service";

export default ModuleProvider(Modules.AUTH, {
	services: [AuthOtpProviderService],
});
