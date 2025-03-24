"use client"
import React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs"
import EmailTab from "../Tabs/EmailTab"
import PasskeyTab from "../Tabs/PasskeyTab"
import PhoneTab from "../Tabs/PhoneTab"
import { DialogTrigger } from "components/ui/dialog"

type AuthTabsProps = {
  activeTab: "email" | "phone" | "passkey"
  submittedValue: string
  setActiveTab: (tab: "email" | "phone" | "passkey") => void
  setSubmittedValue: (value: string) => void
  setCurrentModal: (modal: "default" | "success" | "passkeySuccess") => void
  resetModal: () => void
  variant?: "custom" | "default"
}

const AuthTabs = ({
  activeTab,
  submittedValue,
  setActiveTab,
  setSubmittedValue,
  setCurrentModal,
  resetModal,
  variant = "default",
}: AuthTabsProps) => {
  return (
    <>
      <div>
        <p className="font-bold pb-5 text-center text-xl">Sign In</p>
      </div>

      <div className="flex flex-col gap-2">
        <Tabs
          defaultValue={activeTab}
          onValueChange={(value: any) => {
            setActiveTab(value as "email" | "phone" | "passkey")
            setSubmittedValue("")
          }}
        >
          <TabsList className="grid w-full grid-cols-3 rounded-xl h-max *:py-[6px] *:rounded-xl">
            <TabsTrigger value="email">
              <p className="text-caption1 font-semibold hover:text-black">
                Email
              </p>
            </TabsTrigger>
            <TabsTrigger value="phone">
              <p className="text-caption1 font-semibold hover:text-black">
                Phone
              </p>
            </TabsTrigger>
            <TabsTrigger value="passkey">
              <p className="text-caption1 font-semibold hover:text-black">
                Passkey
              </p>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="email">
            <EmailTab
              submittedValue={submittedValue}
              setSubmittedValue={setSubmittedValue}
              setCurrentModal={setCurrentModal}
            />
          </TabsContent>
          <TabsContent value="phone">
            <PhoneTab
              submittedValue={submittedValue}
              setSubmittedValue={setSubmittedValue}
              setCurrentModal={setCurrentModal}
            />
          </TabsContent>
          <TabsContent value="passkey">
            <PasskeyTab
              resetModal={resetModal}
              submittedValue={submittedValue}
              setSubmittedValue={setSubmittedValue}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}

export default AuthTabs
