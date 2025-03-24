"use client"
import React from "react"
import { Button } from "@medusajs/ui"
import { AlertDialogTitle } from "components/ui/alert-dialog"

const PasskeyVerification = () => {
  return (
    <>
      <AlertDialogTitle>
        <p className="font-semibold text-body1">Passkey</p>
      </AlertDialogTitle>
      <div className="flex flex-col gap-2">
        <p className="text-center font-semibold text-body1">
          Waiting for the passkey
        </p>
        <p className="text-caption1 text-center">
          Please follow the prompts to verify your passkey.
        </p>
        <Button variant="primary" className="rounded-full">
          Continue
        </Button>
      </div>
    </>
  )
}

export default PasskeyVerification
