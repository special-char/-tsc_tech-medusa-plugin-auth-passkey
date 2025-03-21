import { container } from "@medusajs/framework";
import { Modules } from "@medusajs/framework/utils";

async function sendOtpToEmail(email: string, otp: string) {
  const notificationModuleService = container.resolve(Modules.NOTIFICATION);
  const otpNotification = await notificationModuleService.createNotifications([
    {
      channel: "email",
      to: email,
      template: "otp",
      data: { otp },
    },
  ]);
  return otpNotification;
}

export default sendOtpToEmail;
