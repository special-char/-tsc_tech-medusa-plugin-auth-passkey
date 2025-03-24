import LoginTemplate from "@modules/account/templates/login-template"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Brain Spa account.",
}

export default function Login() {
  return (
    <div className="flex items-center justify-center">
      <LoginTemplate />
    </div>
  )
}
