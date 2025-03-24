"use client"
import React, { useState } from "react"
import {
  clearUserExistOrNot,
  PassKeyGenerated,
  registerPasskey,
} from "@lib/data/customer"
import { startRegistration } from "@simplewebauthn/browser"
import { useToast } from "hooks/use-toast"
import { DialogTrigger } from "components/ui/dialog"
import { Button } from "@medusajs/ui"

type Props = {
  submittedValue: string
  setIsLoading: (loading: boolean) => void
  variant?: "custom" | "default"
}

const PassKeyRegisterAlert = ({
  submittedValue,
  setIsLoading,
  variant = "default",
}: Props) => {
  const { toast } = useToast()
  const [otpError, setOtpError] = useState<string>("")
  const handlePassKeyGenerated = async () => {
    try {
      clearUserExistOrNot()
      setIsLoading(true)
      const optionsJSON = await PassKeyGenerated()
      // return res

      let attResp
      try {
        // Pass the options to the authenticator and wait for a response
        attResp = await startRegistration({ optionsJSON })
      } catch (error: any) {
        // Some basic error handling
        if (error.name === "InvalidStateError") {
          return toast({
            title: "Fail to add device",
            description:
              "Authenticator was probably already registered by user",
          })
        } else {
          return error
        }
      }
      const resReg = await registerPasskey(
        optionsJSON.user.name,
        optionsJSON.challenge,
        attResp
      )
      if (resReg.token) {
        return toast({
          title: "Device added success",
          description: "Your Device is successfully added",
        })
      }
    } catch (error) {
      console.error(error)
      setOtpError("PassKey Fail")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {variant === "custom" ? (
        <div>
          <p className="font-semibold text-body2 text-center">
            Welcome {submittedValue}
          </p>
        </div>
      ) : (
        <DialogTrigger asChild>
          <p className="font-semibold text-body2 text-center">
            Welcome {submittedValue}
          </p>
        </DialogTrigger>
      )}

      <div className="flex flex-col gap-4">
        <p className="text-caption1 text-center">Do you want to add passkey?</p>
        <div className="flex gap-4">
          <Button
            className="flex-1 bg-black hover:bg-black/85 rounded-lg"
            onClick={handlePassKeyGenerated}
          >
            Yes
          </Button>
          <Button
            className="flex-1 bg-[#f1f1f1] hover:bg-[#f1f1f1]/50 text-black rounded-lg"
            onClick={() => clearUserExistOrNot()}
          >
            No
          </Button>
        </div>
      </div>
    </>
  )
}

export default PassKeyRegisterAlert
