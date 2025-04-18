import { InjectManager, MedusaContext, MedusaService } from "@medusajs/framework/utils";
import { Otp } from "./models/otp";
import { SqlEntityManager } from "@mikro-orm/postgresql";
import { Context } from "@medusajs/framework/types";
class OtpModuleService extends MedusaService({
	Otp,
}) {
	@InjectManager()
	async updateCustomer(
		customer_id: string,
		auth_identity_id: string,
		@MedusaContext() sharedContext?: Context<SqlEntityManager>
	): Promise<void> {
		if (!sharedContext?.manager) {
			throw new Error("Shared context or manager is undefined.");
		}

		await sharedContext.manager.execute(
			"UPDATE public.auth_identity SET app_metadata = ? WHERE id = ?",
			[{ customer_id: customer_id }, auth_identity_id]
		);

		await sharedContext.manager.execute(
			"UPDATE public.customer SET has_account = true WHERE id = ?",
			[customer_id]
		);

		return;
	}
}

export default OtpModuleService;
