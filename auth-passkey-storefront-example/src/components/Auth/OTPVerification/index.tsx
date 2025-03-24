"use client"
import React, { useState } from "react"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "components/ui/input-otp"
import CheckIcon from "../../../../public/icon/check.svg"
import Spinner from "components/common/Spinner"
import { DialogTrigger } from "components/ui/dialog"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { Button } from "@medusajs/ui"
import { authenticateByOtp } from "@lib/data/customer"

type OTPVerificationProps = {
  activeTab: string
  submittedValue: string
  onSuccess: () => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  handleSetCurrentModal: any
  variant?: "custom" | "default"
}

const OTPVerification = ({
  activeTab,
  submittedValue,
  onSuccess,
  isLoading,
  setIsLoading,
  handleSetCurrentModal,
  variant = "default",
}: OTPVerificationProps) => {
  const [otpValue, setOtpValue] = useState<string>("")
  const [otpError, setOtpError] = useState<string>("")

  const handleVerifyOtp = async () => {
    setOtpError("")
    try {
      setIsLoading(true)
      //auth logic with has passkey check
      const res = await authenticateByOtp(submittedValue, otpValue, activeTab)
      onSuccess()
      if (res?.hasPassKey === false) {
        handleSetCurrentModal("customerHasMany")
      }
    } catch (error) {
      console.error(error)
      setOtpError("Invalid OTP. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div>
        <p className="font-bold pb-5 text-center text-xl">
          Confirm {activeTab}
        </p>
      </div>

      <p className="text-center text-caption1 pb-5">
        Enter the verification code sent to <br />
        <span className="font-semibold">{submittedValue}</span>
      </p>
      <div className="flex flex-col gap-4 justify-center items-center w-full">
        <InputOTP
          maxLength={6}
          pattern={REGEXP_ONLY_DIGITS}
          value={otpValue}
          onChange={(value) => setOtpValue(value)}
        >
          <InputOTPGroup className="w-full flex gap-2 *:rounded-md *:w-10 *:h-10 *:border-2 justify-between">
            {Array.from({ length: 6 }).map((_, index) => (
              <InputOTPSlot key={index} index={index} />
            ))}
          </InputOTPGroup>
        </InputOTP>

        {otpError && (
          <p className="text-red-500 text-sm text-center">{otpError}</p>
        )}
        <Button
          variant="primary"
          className="w-[280px]"
          onClick={handleVerifyOtp}
        >
          {!isLoading && <CheckIcon className="!w-5 !h-5 mt-[2px]" />}
          {isLoading ? <Spinner /> : "Verify"}
        </Button>
      </div>
    </>
  )
}

export default OTPVerification
