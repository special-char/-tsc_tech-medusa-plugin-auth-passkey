import { MedusaService } from "@medusajs/framework/utils";
import { Otp } from "./models/otp";

class OtpModuleService extends MedusaService({
	Otp,
}) {}

export default OtpModuleService;
