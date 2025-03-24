import { Suspense } from "react"

import { listRegions } from "@lib/data/regions"
import { StoreCustomer, StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import LoginModal from "components/Auth/LoginModal"
import UserIcon from "../../../../../public/icon/user.svg"
import UserWithVerifyIcon from "../../../../../public/icon/userloggedin.svg"
import { retriveUserExistOrNot } from "@lib/data/customer"

export default async function Nav({
  customer,
}: {
  customer: StoreCustomer | null
}) {
  const regions = await listRegions().then((regions: StoreRegion[]) => regions)
  const userExistOrNot = await retriveUserExistOrNot()

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative h-16 mx-auto border-b duration-200 bg-white border-ui-border-base">
        <nav className="content-container txt-xsmall-plus text-ui-fg-subtle flex items-center justify-between w-full h-full text-small-regular">
          <div className="flex-1 basis-0 h-full flex items-center">
            <div className="h-full">
              <SideMenu regions={regions} />
            </div>
          </div>

          <div className="flex items-center h-full">
            <LocalizedClientLink
              href="/"
              className="txt-compact-xlarge-plus hover:text-ui-fg-base uppercase"
              data-testid="nav-store-link"
            >
              Medusa Store
            </LocalizedClientLink>
          </div>

          <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
            {/* <div className="hidden small:flex items-center gap-x-6 h-full">
              <LocalizedClientLink
                className="hover:text-ui-fg-base"
                href="/account"
                data-testid="nav-account-link"
              >
                Account
              </LocalizedClientLink>
            </div> */}
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
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="hover:text-ui-fg-base flex gap-2"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  Cart (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  )
}
