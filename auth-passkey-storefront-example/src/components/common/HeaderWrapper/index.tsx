"use client"

import LoginModal from "components/Auth/LoginModal"
import NavLinks from "components/common/Navbar/NavLinks"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "components/ui/sheet"
import { navLink } from "@lib/constData"
import { StoreCustomer } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"
import Link from "next/link"
import { PropsWithChildren, useState, useCallback } from "react"
import CancelIcon from "../../../../public/icon/cancel.svg"
import SearchIcon from "../../../../public/icon/search.svg"
import HamburgerIcon from "../../../../public/icon/hamburger.svg"
import UserIcon from "../../../../public/icon/user.svg"
import { useRouter } from "next/navigation"
import UserWithVerifyIcon from "../../../../public/icon/userloggedin.svg"
interface SearchResult {
  handle: string
  title: string
}

const HeaderWrapper = ({
  customer,
  children,
  userExistOrNot,
}: {
  customer: StoreCustomer | null
  userExistOrNot: Boolean | null
} & PropsWithChildren) => {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const router = useRouter()

  // Debounce function
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout
    return (...args: any[]) => {
      if (timeoutId) clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        func(...args)
      }, delay)
    }
  }

  // Search function with debounce

  return (
    <header className="relative flex flex-col">
      <>
        <div className="flex max-sm:py-3 py-4">
          <div className="max-md:hidden flex-1" />
          <div className="flex flex-1 items-center md:hidden">
            <Sheet>
              <SheetTrigger>
                <HamburgerIcon className="h-6 w-6" />
              </SheetTrigger>
              <SheetContent className="w-full p-0 md:hidden" varient="custom">
                <SheetHeader>
                  <SheetTitle></SheetTitle>
                </SheetHeader>
                <div className="flex flex-col divide-y">
                  <SheetClose className="flex justify-end p-4">
                    <CancelIcon className="w-6 h-6" />
                  </SheetClose>
                  {navLink.map((item, index) => (
                    <LocalizedClientLink
                      key={index}
                      href={item.link}
                      className="text-center p-5"
                    >
                      <SheetClose>{item.title}</SheetClose>
                    </LocalizedClientLink>
                  ))}
                  <Link
                    className="text-center p-5"
                    href={"https://app.squareup.com/gift/ML8V5CKPH2YEF/order"}
                  >
                    Gift card
                  </Link>
                  {customer ? (
                    userExistOrNot ? (
                      <div className="flex w-full items-center justify-center p-5">
                        <LoginModal>
                          <span className="flex gap-1 items-center">
                            <UserIcon className="h-6 w-6" /> Sign In
                          </span>
                        </LoginModal>
                      </div>
                    ) : (
                      <LocalizedClientLink href={`/account`}>
                        <SheetClose className="flex gap-1 items-center justify-center p-5 w-full">
                          <UserWithVerifyIcon className="h-6 w-6" /> Account
                        </SheetClose>
                      </LocalizedClientLink>
                    )
                  ) : (
                    <div className="flex w-full items-center justify-center p-5">
                      <LoginModal>
                        <span className="flex gap-1 items-center">
                          <UserIcon className="h-6 w-6" /> Sign In
                        </span>
                      </LoginModal>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <LocalizedClientLink
            href="/"
            className="relative w-[60px] sm:w-[140px] aspect-square"
          >
            <Image
              src="/images/db-does-it-logo.png"
              alt="logo"
              fill
              className="object-cover"
            />
          </LocalizedClientLink>
          <div className="flex flex-1 justify-end items-center gap-4 max-sm:gap-2">
            <button
              onClick={() => setOpen(true)}
              className="cursor-pointer"
              aria-label="Search"
            >
              <SearchIcon className="h-6 w-6" />
            </button>
            {customer ? (
              userExistOrNot ? (
                <LoginModal>
                  <UserIcon className="h-6 w-6" />
                </LoginModal>
              ) : (
                <LocalizedClientLink href={`/account`}>
                  <UserWithVerifyIcon className="h-6 w-6" />
                </LocalizedClientLink>
              )
            ) : (
              <LoginModal>
                <UserIcon className="h-6 w-6" />
              </LoginModal>
            )}
            {children}
          </div>
        </div>
        <NavLinks data={navLink} />
      </>
    </header>
  )
}

export default HeaderWrapper

// {customer ? (
//   userExistOrNot ? (
//     <LoginModal>
//       <UserIcon className="h-6 w-6" />
//     </LoginModal>
//   ) : (
//     <LocalizedClientLink href={`/account`}>
//       <UserWithVerifyIcon className="h-6 w-6" />
//     </LocalizedClientLink>
//   )
// ) : (
//   <LoginModal>
//     <UserIcon className="h-6 w-6" />
//   </LoginModal>
// )}

// {customer ? (
//   userExistOrNot ? (
//     <div className="flex w-full items-center justify-center p-5">
//       <LoginModal>
//         <span className="flex gap-1 items-center">
//           <UserIcon className="h-6 w-6" /> Sign In
//         </span>
//       </LoginModal>
//     </div>
//   ) : (
//     <LocalizedClientLink href={`/account`}>
//       <SheetClose className="flex gap-1 items-center justify-center p-5 w-full">
//         <UserWithVerifyIcon className="h-6 w-6" /> Account
//       </SheetClose>
//     </LocalizedClientLink>
//   )
// ) : (
//   <div className="flex w-full items-center justify-center p-5">
//     <LoginModal>
//       <span className="flex gap-1 items-center">
//         <UserIcon className="h-6 w-6" /> Sign In
//       </span>
//     </LoginModal>
//   </div>
// )}
