import React, { Suspense } from "react"
import CartIcon from "../../../../public/icon/cart.svg"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import { StoreCustomer } from "@medusajs/types"
import { retriveUserExistOrNot } from "@lib/data/customer"
import LoginModal from "components/Auth/LoginModal"
import HeaderWrapper from "../HeaderWrapper"

type Props = {
  customer: StoreCustomer | null
}

const Navbar = async ({ customer }: Props) => {
  const userExistOrNot = await retriveUserExistOrNot()

  return (
    <HeaderWrapper customer={customer} userExistOrNot={userExistOrNot}>
      {customer ? (
        customer?.metadata?.ifVerify && customer?.metadata?.veriffSessionId ? (
          <Suspense
            fallback={
              <LocalizedClientLink href="/cart">
                <CartIcon className="h-6 w-6" />
              </LocalizedClientLink>
            }
          >
            <CartButton />
          </Suspense>
        ) : (
          // <LocalizedClientLink href={`/account`}>
          <CartIcon className="h-6 w-6" />
          // </LocalizedClientLink>
        )
      ) : (
        <LoginModal>
          <CartIcon className="h-6 w-6" />
        </LoginModal>
      )}
      {/* <Suspense
        fallback={
          <LocalizedClientLink href="/cart">
            <CartIcon className="h-6 w-6" />
          </LocalizedClientLink>
        }
      >
        <CartButton />
      </Suspense> */}
    </HeaderWrapper>
  )
}

export default Navbar
