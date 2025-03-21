import { model } from "@medusajs/framework/utils"

export const Otp = model.define("otp", {
    id: model.id().primaryKey(),
    phone: model.text(),
    otp: model.text(),
    expires_at: model.dateTime(),
})
