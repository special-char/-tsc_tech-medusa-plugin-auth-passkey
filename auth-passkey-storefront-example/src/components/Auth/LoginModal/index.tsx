"use client"
import React, { useState } from "react"
import OTPVerification from "../OTPVerification"
import AuthTabs from "../AuthTabs"
import ChevronIcon from "../../../../public/icon/chevronDown.svg"
import CrossIcon from "../../../../public/icon/cancel.svg"
import PassKeyRegisterAlert from "../PassKeyRegisterAlert"
import useToggleState from "@lib/hooks/use-toggle-state"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "components/ui/dialog"
import { useToast } from "hooks/use-toast"
import { Button } from "@medusajs/ui"

type Props = {
  children?: React.ReactNode
}

const LoginModal = ({ children }: Props) => {
  const { toast } = useToast()
  const { state, open, close } = useToggleState()

  const [currentModal, setCurrentModal] = useState<
    "default" | "success" | "passkeySuccess" | "customerHasMany"
  >("default")
  const [submittedValue, setSubmittedValue] = useState<string>("")
  const [activeTab, setActiveTab] = useState<"email" | "phone" | "passkey">(
    "email"
  )
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleSetCurrentModal = (modalState: any) => {
    setCurrentModal(modalState)
  }

  const resetModal = () => {
    setCurrentModal("default")
    setSubmittedValue("")
    close()
  }

  const handleSuccess = () => {
    toast({
      title: "Sign-in Successful",
      description: "You have successfully signed in.",
    })
    // close()
  }

  const renderModalContent = () => {
    switch (currentModal) {
      case "success":
        return (
          <OTPVerification
            activeTab={activeTab}
            submittedValue={submittedValue}
            onSuccess={handleSuccess}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            handleSetCurrentModal={handleSetCurrentModal}
          />
        )

      case "customerHasMany":
        return (
          <PassKeyRegisterAlert
            submittedValue={submittedValue}
            setIsLoading={setIsLoading}
          />
        )
      default:
        return (
          <AuthTabs
            activeTab={activeTab}
            submittedValue={submittedValue}
            setActiveTab={setActiveTab}
            setSubmittedValue={setSubmittedValue}
            setCurrentModal={setCurrentModal}
            resetModal={resetModal}
          />
        )
    }
  }

  const handleModal = () => {
    open()
  }

  return (
    <>
      <button
        className="flex gap-x-1 text-sm items-center cursor-pointer"
        onClick={() => handleModal()}
      >
        <span>{children}</span>
      </button>
      <Dialog open={state} onOpenChange={close} modal>
        <DialogContent className="max-w-[600px] [&>button]:hidden bg-white">
          {currentModal !== "customerHasMany" && (
            <DialogHeader>
              <Button
                onClick={resetModal}
                className="p-2 aspect-square hover:bg-[#ebebeb] bg-white shadow-2xl shadow-black border-none outline-none self-end"
              >
                <CrossIcon className="!h-6 !w-6 text-black" />
              </Button>
            </DialogHeader>
          )}
          {renderModalContent()}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default LoginModal
