import { container } from "@medusajs/framework";
import { Modules } from "@medusajs/framework/utils";

async function sendOtpToPhone(phone: string, otp: string) {
  const notificationModuleService = container.resolve(Modules.NOTIFICATION);
  const otpNotification = await notificationModuleService.createNotifications([
    {
      channel: "sms",
      to: phone,
      template: "otp",
      data: { otp },
    },
  ]);
  return otpNotification;
}

export default sendOtpToPhone;
