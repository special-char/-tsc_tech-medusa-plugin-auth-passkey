"use client"
import React, { useState } from "react"
import { Input } from "components/ui/input"
import { Button } from "components/ui/button"
import { useToast } from "hooks/use-toast"
import ArrowIcon from "../../../../public/icon/arrow.svg"
import Spinner from "components/common/Spinner"
import { getAuthOtp } from "lib/data/customer"

type EmailTabProps = {
  submittedValue: string
  setSubmittedValue: (value: string) => void
  setCurrentModal: (modal: "default" | "success" | "passkeySuccess") => void
}

const EmailTab = ({
  submittedValue,
  setSubmittedValue,
  setCurrentModal,
}: EmailTabProps) => {
  const [isLoading, setisLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setisLoading(true)
    const res = await getAuthOtp("email", submittedValue)
    if (res.error) {
      toast({
        variant: "destructive",
        title: res.error,
        description:
          "This email is linked to a Google account. Please log in with Google.",
      })
    } else {
      setCurrentModal("success")
    }
    setisLoading(false)
  }

  return (
    <form className="w-full flex flex-col" onSubmit={handleSubmit}>
      <div className="relative w-full">
        <Input
          name="email"
          type="email"
          required
          placeholder="email@acme.com"
          className="rounded-xl text-caption1"
          value={submittedValue}
          onChange={(e) => setSubmittedValue(e.target.value)}
        />
        <Button
          className={`absolute inset-y-0 right-0 my-1 mr-1 h-auto aspect-square !px-4 !py-0 text-white rounded-xl disabled:cursor-not-allowed shadow-sm ${
            submittedValue
              ? "bg-[#00cb48] hover:bg-[#00cb48d9] text-white hover:text-white"
              : "bg-black hover:bg-[#dddddd]"
          }`}
          disabled={isLoading}
        >
          {isLoading ? <Spinner /> : "GO"}
        </Button>
      </div>
      <p className="text-xxs pl-2 h-5" />
    </form>
  )
}
export default EmailTab
