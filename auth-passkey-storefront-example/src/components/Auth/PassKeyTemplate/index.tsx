"use client"
import { useToast } from "hooks/use-toast"
import { PassKeyGenerated, registerPasskey } from "@lib/data/customer"
import Spinner from "@modules/common/icons/spinner"
import { startRegistration } from "@simplewebauthn/browser"
import React, { useState } from "react"
import { Button } from "@medusajs/ui"

type Props = {}

const PassKeyTemplate = (props: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { toast } = useToast()
  const handlePassKeyGenerated = async () => {
    try {
      setIsLoading(true)
      const optionsJSON = await PassKeyGenerated()

      let attResp
      try {
        // Pass the options to the authenticator and wait for a response
        attResp = await startRegistration({ optionsJSON })
      } catch (error: any) {
        // Some basic error handling
        if (error.name === "InvalidStateError") {
          return toast({
            variant: "destructive",
            title: "This device already exist",
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
      toast({
        variant: "destructive",
        title: "Passkey fail",
        description: "Passkey fail",
      })
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div>
      <h1 className="text-2xl-semi">Passkey</h1>
      <div className="flex flex-col gap-2">
        <p className="small !leading-6">
          Passkeys are an easier and safer way to sign in than passwords. It
          works with the same face, fingerprint, or PIN you already use to
          unlock your device. We don't store your face, fingerprint, or PIN
          data.
        </p>
        <Button
          className="rounded-full w-max px-10"
          onClick={handlePassKeyGenerated}
        >
          {isLoading ? <Spinner /> : "Set up"}
        </Button>
      </div>
    </div>
  )
}

export default PassKeyTemplate
