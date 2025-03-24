import LocalizedClientLink from "@modules/common/components/localized-client-link"
import React, { Suspense } from "react"
import NavLinks from "./NavLinks"
import Image from "next/image"
import SearchIcon from "@public/icons/search.svg"
import UserIcon from "@public/icons/user.svg"
import CartIcon from "@public/icons/cart.svg"
import CartButton from "@modules/layout/components/cart-button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@components/ui/sheet"
import Link from "next/link"
import HamburgerIcon from "@public/icons/hamburger.svg"
import CancelIcon from "@public/icons/cancel.svg"

type Props = {
  navLink: any
}

const StickyNav = ({ navLink }: Props) => {
  return (
    <header className="flex items-center justify-between gap-4 fixed top-0">
      <div className="flex flex-1 items-center md:hidden py-4">
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
              {navLink.map((item, index) => {
                return (
                  <LocalizedClientLink
                    key={index}
                    href={item.link}
                    className="text-center p-5"
                  >
                    <SheetClose>{item.title}</SheetClose>
                  </LocalizedClientLink>
                )
              })}
              <Link
                className="text-center p-5"
                href={"https://app.squareup.com/gift/ML8V5CKPH2YEF/order"}
              >
                Gift card
              </Link>
              <LocalizedClientLink href={`/account`}>
                <SheetClose className="flex items-center justify-center p-5 w-full">
                  <UserIcon className="h-6 w-6" />
                  Sign In
                </SheetClose>
              </LocalizedClientLink>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <LocalizedClientLink
        href={"/"}
        className="relative w-[60px] aspect-square md:hidden"
      >
        <Image
          src={"/images/db-does-it-logo.png"}
          alt="logo"
          fill
          className="object-cover"
        />
      </LocalizedClientLink>
      <div className="max-md:hidden flex-1" />
      <NavLinks data={navLink} className="!pb-4 pt-4" />
      <div className="flex-1 flex gap-2 justify-end items-center">
        <SearchIcon className="h-6 w-6" />
        <LocalizedClientLink href={`/account`}>
          <UserIcon className="h-6 w-6" />
        </LocalizedClientLink>
        <Suspense
          fallback={
            <LocalizedClientLink href="/cart">
              <CartIcon className="h-6 w-6" />
            </LocalizedClientLink>
          }
        >
          <CartButton />
        </Suspense>
      </div>
    </header>
  )
}

export default StickyNav
