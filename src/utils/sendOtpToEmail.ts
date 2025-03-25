import { container } from "@medusajs/framework";
import { Modules } from "@medusajs/framework/utils";
import { decryptOtp } from "./otp-encrypt-decrypt";
import otpEmailTemplate from "./otp-template-email";

async function sendOtpToEmail(email: string, otp: string) {
  const notificationModuleService = container.resolve(Modules.NOTIFICATION);
  const decryptedOtp = decryptOtp(otp);
  const otpNotification = await notificationModuleService.createNotifications([
    {
      channel: "email",
      to: email,
      template: otpEmailTemplate(decryptedOtp),
      data: { otp },
    },
  ]);
  return otpNotification;
}

export default sendOtpToEmail;
