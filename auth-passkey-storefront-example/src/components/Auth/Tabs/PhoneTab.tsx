"use client"
import React, { useState } from "react"
import { Input } from "components/ui/input"
import { Button } from "components/ui/button"
import { getAuthOtp } from "lib/data/customer"
import { useToast } from "hooks/use-toast"
import ArrowIcon from "../../../../public/icon/arrow.svg"
import Spinner from "components/common/Spinner"

type PhoneTabProps = {
  submittedValue: string
  setSubmittedValue: (value: string) => void
  setCurrentModal: (modal: "default" | "success" | "passkeySuccess") => void
}

const PhoneTab = ({
  submittedValue,
  setSubmittedValue,
  setCurrentModal,
}: PhoneTabProps) => {
  const [isLoading, setisLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      setisLoading(true)
      await getAuthOtp("phone", submittedValue)
      setCurrentModal("success")
    } catch (error) {
      setisLoading(true)
      console.error(error)
      toast({
        title: "Failed to Send OTP",
        description: "An error occurred while sending the OTP.",
        variant: "destructive",
      })
    } finally {
      setisLoading(false)
    }
  }

  return (
    <form className="flex flex-col" onSubmit={handleSubmit}>
      <div className="relative w-full">
        <Input
          name="phone"
          type="tel"
          required
          placeholder="+1 (555) 000-0000"
          className="rounded-xl"
          value={submittedValue}
          maxLength={15}
          minLength={10}
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
      <p className="text-xxs pl-2 text-primary">
        Note: Country code is required
      </p>
    </form>
  )
}

export default PhoneTab
