"use client"

import OTPVerification from "components/Auth/OTPVerification"
import PassKeyRegisterAlert from "components/Auth/PassKeyRegisterAlert"
import { useToast } from "hooks/use-toast"
import useToggleState from "@lib/hooks/use-toggle-state"
import { useState } from "react"
import ChevronIcon from "../../../../public/icon/chevronDown.svg"
import AuthTabs from "components/Auth/AuthTabs"
import { Button } from "@medusajs/ui"

type Props = {}

const LoginTemplate = (props: Props) => {
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
            variant="custom"
          />
        )
      // case "passkeySuccess":
      //   return <PasskeyVerification />
      case "customerHasMany":
        return (
          <PassKeyRegisterAlert
            submittedValue={submittedValue}
            setIsLoading={setIsLoading}
            variant="custom"
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
            variant="custom"
          />
        )
    }
  }

  return (
    <div className="max-w-lg w-full border p-6 rounded-lg">
      {renderModalContent()}
      {/* {currentModal !== "customerHasMany" && (
        <div className="mt-2 flex gap-2">
          {currentModal !== "default" && (
            <Button
              variant="primary"
              onClick={() => handleSetCurrentModal("default")}
              className="w-full flex p-2 aspect-square hover:bg-[#ebebeb] bg-white border rounded-full outline-none"
            >
              <ChevronIcon className="rotate-90 !h-4 !w-4 mt-[2px]" />
              Back
            </Button>
          )}
        </div>
      )} */}
    </div>
  )
}

export default LoginTemplate

// "use client"

// import { useState } from "react"

// import Register from "@modules/account/components/register"
// import Login from "@modules/account/components/login"

// export enum LOGIN_VIEW {
//   SIGN_IN = "sign-in",
//   REGISTER = "register",
// }

// const LoginTemplate = () => {
//   const [currentView, setCurrentView] = useState("sign-in")

//   return (
//     <div className="w-full flex justify-center">
//       {currentView === "sign-in" ? (
//         <Login setCurrentView={setCurrentView} />
//       ) : (
//         <Register setCurrentView={setCurrentView} />
//       )}
//     </div>
//   )
// }

// export default LoginTemplate
