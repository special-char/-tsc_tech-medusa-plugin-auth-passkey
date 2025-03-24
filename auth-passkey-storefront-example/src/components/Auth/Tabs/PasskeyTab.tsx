"use client"
import React from "react"
import { Input } from "components/ui/input"
import { Button } from "components/ui/button"
import ArrowIcon from "../../../../public/icon/arrow.svg"
import {
  authenticatePasskey,
  PassKeyGeneratedWithoutAuth,
} from "@lib/data/customer"
import { startAuthentication } from "@simplewebauthn/browser"
import { useToast } from "hooks/use-toast"

type PasskeyTabProps = {
  submittedValue: string
  setSubmittedValue: (value: string) => void
  resetModal: () => void
}

const PasskeyTab = ({
  submittedValue,
  setSubmittedValue,
  resetModal,
}: PasskeyTabProps) => {
  const { toast } = useToast()
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    let email = submittedValue.toString()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(submittedValue.toString())) {
      email = `${submittedValue.toString()}@brainspa.com`
    }

    const optionsJSON = await PassKeyGeneratedWithoutAuth(email)
    // return res
    if (optionsJSON.message) {
      return toast({
        variant: "destructive",
        title: optionsJSON.message,
        description:
          "To proceed with passkey please register with E-mail or Phone",
      })
    }
    let attResp
    try {
      // Pass the options to the authenticator and wait for a response
      attResp = await startAuthentication({ optionsJSON })
    } catch (error: any) {
      // Some basic error handling
      if (error.name === "InvalidStateError") {
        return toast({
          variant: "destructive",
          title: "Fail to Login device",
          description: "Authenticator was probably not registered by user",
        })
      } else {
        return error
      }
    }
    const resReg = await authenticatePasskey(
      email,
      optionsJSON.challenge,
      attResp
    )

    if (resReg.token) {
      return (
        toast({
          title: "Sign-in Successful",
          description: "You have successfully signed in.",
        }),
        resetModal()
      )
    } else {
      return toast({
        title: "Login Fail",
        description: resReg.message,
      })
    }
  }

  return (
    <form className="flex flex-col" onSubmit={handleSubmit}>
      <div className="relative w-full">
        <Input
          name="passkey"
          required
          placeholder="Enter email or phone number"
          className="rounded-xl text-caption1"
          value={submittedValue}
          onChange={(e) => {
            setSubmittedValue(e.target.value)
          }}
        />
        <Button
          className={`absolute inset-y-0 right-0 my-1 mr-1 h-auto aspect-square !px-4 !py-0 text-white  rounded-xl shadow-sm ${
            submittedValue
              ? "bg-[#00cb48] hover:bg-[#00cb48d9] text-white hover:text-white"
              : "bg-black hover:bg-[#dddddd] hover:text-black"
          }`}
        >
          GO
        </Button>
      </div>
      <p className="text-xxs pl-2 h-5" />
    </form>
  )
}

export default PasskeyTab
