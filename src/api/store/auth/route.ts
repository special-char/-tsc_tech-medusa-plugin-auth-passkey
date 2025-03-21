import {
  AuthenticatedMedusaRequest,
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http";
import { NotificationDTO } from "@medusajs/framework/types";
import crypto from "crypto";
import { encryptOtp } from "../../../utils/otp-encrypt-decrypt";
import OtpModuleService from "../../../modules/otp/service";
import { OTP_MODULE } from "../../../modules/otp";
import sendOtpToEmail from "../../../utils/sendOtpToEmail";
import sendOtpToPhone from "../../../utils/sendOtpToPhone";

interface RequestBody {
  phone?: string;
  email?: string;
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  console.log("hello");

  const { phone, email } = req.body as RequestBody;

  if (!phone && !email) {
    return res
      .status(400)
      .json({ error: "At least one of phone number or email is required." });
  }

  const otp = crypto.randomInt(100000, 999999).toString();

  const encryptedOtp = encryptOtp(otp);
  const otpModuleService: OtpModuleService = req.scope.resolve(OTP_MODULE);
  let otpNotification: NotificationDTO[] = [];
  const query = req.scope.resolve("query");
  const { data: auth } = await query.graph({
    entity: "provider_identities",
    fields: ["*"],
    filters: {
      provider: "google",
    },
  });
  if (phone) {
    console.log(`OTP for ${phone} is ${otp}`);
    const data = auth.filter(
      (e: any) =>
        e.user_metadata["email"] ==
        `${phone}@${process.env.PROJECT_NAME || "thespecialcharacter"}.com`
    );

    if (data.length != 0) {
      return res
        .status(404)
        .json({ error: "user is alredy register with google." });
    }
    await otpModuleService.deleteOtps({
      phone: `${phone}@${
        process.env.PROJECT_NAME || "thespecialcharacter"
      }.com`,
    });

    await otpModuleService.createOtps({
      phone: `${phone}@${
        process.env.PROJECT_NAME || "thespecialcharacter"
      }.com`,
      otp: encryptedOtp,
      expires_at: Date.now() + 5 * 60 * 1000,
    });
    // otpNotification = await sendOtpToPhone(phone, encryptedOtp);
  } else if (email) {
    console.log(`OTP for ${email} is ${otp}`);
    const data = auth.filter((e: any) => e.user_metadata["email"] == email);
    if (data.length != 0) {
      return res
        .status(400)
        .json({ message: "User is already registered with google." });
    }
    await otpModuleService.deleteOtps({ phone: email });
    await otpModuleService.createOtps({
      phone: email,
      otp: encryptedOtp,
      expires_at: Date.now() + 5 * 60 * 1000,
    });

    // otpNotification = await sendOtpToEmail(email, encryptedOtp);
  }
  res.status(200).json({ message: "OTP sent successfully." });
};

// export const GET = async (
//   req: AuthenticatedMedusaRequest,
//   res: MedusaResponse
// ) => {
//   // const auth_identity_id = req.auth_context.auth_identity_id;
//   const auth_identity_id = req.query.authidentity;
//   const query = req.scope.resolve("query");
//   const { data: providerIdentity } = await query.graph<any>({
//     entity: "provider_identity",
//     fields: ["*", "auth_identity.*"],
//     filters: {
//       auth_identity: {
//         id: auth_identity_id,
//       },
//     },
//   });

//   if (
//     providerIdentity &&
//     providerIdentity.length > 0 &&
//     providerIdentity[0].auth_identity_id === auth_identity_id
//   ) {
//     return res.send(providerIdentity[0]);
//   }

//   return res.status(404).json({ error: "Provider identity not found." });
// };

export const GET = (req: MedusaRequest, res: MedusaResponse) => {
  res.json({
    message: "Auth route works!",
  });
};
