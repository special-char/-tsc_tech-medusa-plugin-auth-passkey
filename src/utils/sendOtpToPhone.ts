import { container } from "@medusajs/framework";
import { Modules } from "@medusajs/framework/utils";
import { decryptOtp } from "./otp-encrypt-decrypt";
import otpSmsTemplate from "./otp-template-sms";

async function sendOtpToPhone(phone: string, otp: string) {
  const notificationModuleService = container.resolve(Modules.NOTIFICATION);
  const decryptedOtp = decryptOtp(otp);
  const otpNotification = await notificationModuleService.createNotifications([
    {
      channel: "sms",
      to: phone,
      template: otpSmsTemplate(decryptedOtp),
      data: { otp },
    },
  ]);
  return otpNotification;
}

export default sendOtpToPhone;
