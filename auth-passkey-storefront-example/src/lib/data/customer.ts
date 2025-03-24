"use server"

import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { HttpTypes } from "@medusajs/types"
import { revalidateTag } from "next/cache"
import { redirect } from "next/navigation"
import {
  clearBoolExistingUserOrNot,
  getAuthHeaders,
  getBoolExistingUserOrNot,
  getCacheOptions,
  getCacheTag,
  getCartId,
  removeAuthToken,
  removeCartId,
  setAuthToken,
  setBoolExistingUserOrNot,
} from "./cookies"
import { decodeToken } from "react-jwt"
import {
  AuthenticationResponseJSON,
  RegistrationResponseJSON,
} from "@simplewebauthn/browser"

const backend_url = process.env.MEDUSA_BACKEND_URL

export const customerMe = async (token: string) => {
  console.log({ tokenincustomer: token })

  const { customer } = await fetch(`${backend_url}/store/customers/me`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "x-publishable-api-key":
        process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
    },
  }).then((res) => res.json())
  console.log({ customer })

  return customer
}

export const authenticateByOtp = async (
  value: string,
  otp: string,
  activeTab: string
) => {
  const bodyKey = activeTab === "phone" ? "phone" : "email"
  const customerForm = {
    email: activeTab === "phone" ? `${value}@brainspa.com` : value,
  }
  console.log("====================================")
  console.log("calling otp API")
  console.log("====================================")
  const tokenresponse = await fetch(`${backend_url}/auth/customer/otp`, {
    method: "POST",
    body: JSON.stringify({
      [bodyKey]: value,
      otp: otp,
    }),
    headers: {
      "x-publishable-api-key":
        process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
      "Content-Type": "application/json",
    },
  })
  console.log("====================================")
  console.log("done calling otp")
  console.log("====================================")

  if (!tokenresponse.ok) {
    const tokenResponseJson = await tokenresponse.json()
    return { error: tokenResponseJson.message || "otp response not found" }
  }

  const { token } = await tokenresponse.json()
  console.log("🚀 ~ token:", token)

  await setAuthToken(token)

  const shouldCreateCustomer =
    (decodeToken(token) as { actor_id: string }).actor_id === ""

  let existCustomer = false
  if (shouldCreateCustomer) {
    existCustomer = true
    //new user signup logic
    const headers = {
      ...(await getAuthHeaders()),
    }

    const { customer: createdCustomer } = await sdk.store.customer.create(
      customerForm,
      {},
      headers
    )
  }

  const refreshedToken = await getRefreshToken(token)
  await setAuthToken(refreshedToken as string)

  const customerCacheTag = await getCacheTag("customers")
  revalidateTag(customerCacheTag)
  console.log("====================================")
  console.log("customer has asskey endpoint calling")
  console.log("====================================")
  // customer has passKey or not
  const response = await fetch(
    `${process.env.MEDUSA_BACKEND_URL}/store/customer-has-passkey`,
    {
      method: "GET",
      headers: {
        "x-publishable-api-key":
          process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
        Authorization: `Bearer ${refreshedToken}`,
        "Content-Type": "application/json",
      },
    }
  )
  console.log("====================================")
  console.log("done calling passwkey endpoint")
  console.log("====================================")
  const data = await response.json()
  console.log("🚀 ~ data:", data)
  setBoolExistingUserOrNot(!data.hasPasskey)

  // await transferCart()
  return { hasPassKey: data.hasPasskey, existCustomer }
}

export const getRefreshToken = async (authtoken: string) => {
  const response = await fetch(`${backend_url}/auth/token/refresh`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authtoken}`,
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error("Refresh Token API Error:", errorText)
    throw new Error(`Error: Failed to refresh token`)
  }
  const { token } = await response.json()

  console.log("====================================")
  console.log({ refresedtoken: token })
  console.log("====================================")

  return token
}

export const clearUserExistOrNot = async () => {
  await clearBoolExistingUserOrNot()
}

export const PassKeyGenerated = async () => {
  const header = await getAuthHeaders()

  const response = await fetch(
    `${process.env.MEDUSA_BACKEND_URL}/store/passkey`,
    {
      method: "GET",
      headers: {
        "x-publishable-api-key":
          process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
        ...header,
        "Content-Type": "application/json",
      },
    }
  )
  const data = await response.json()
  return data
}

export const registerPasskey = async (
  email: string,
  expectedChallenge: string,
  rest: RegistrationResponseJSON
) => {
  const response = await fetch(
    `${process.env.MEDUSA_BACKEND_URL}/auth/customer/auth-passkey/register`,
    {
      method: "POST",
      headers: {
        "x-publishable-api-key":
          process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        expectedChallenge: expectedChallenge,
        rest: rest,
      }),
    }
  )
  const data = await response.json()
  return data
}

export const getAuthOtp = async (identity: string, value: string) => {
  const bodyKey = identity === "phone" ? "phone" : "email"
  const otpResponse = await fetch(`${backend_url}/store/auth`, {
    method: "POST",
    body: JSON.stringify({ [bodyKey]: value }),
    headers: {
      "x-publishable-api-key":
        process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
      "Content-Type": "application/json",
    },
  })

  try {
    if (!otpResponse.ok) {
      return { error: "otp response not found" }
    }
    console.log("otpResponse.ok", otpResponse.ok)
    const data = await otpResponse.json()

    return data
  } catch (error) {
    console.error("Failed to parse JSON response:", error)
    return { error: "Invalid server response. Please try again." }
  }
}

export const retriveUserExistOrNot = async (): Promise<Boolean | null> => {
  const user = await getBoolExistingUserOrNot()
  if (user) {
    return user.value.toString() == "true" ? true : false
  }
  return false
}

export const authenticatePasskey = async (
  email: string,
  expectedChallenge: string,
  rest: AuthenticationResponseJSON
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/auth/customer/auth-passkey`,
    {
      method: "POST",
      headers: {
        "x-publishable-api-key":
          process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        expectedChallenge: expectedChallenge,
        rest: rest,
      }),
    }
  )
  const data = await response.json()

  if (data.token) {
    console.log("====================================")
    console.log("data.token::::", data.token)
    console.log("====================================")
    await setAuthToken(data.token)
  }

  return data
}

export const PassKeyGeneratedWithoutAuth = async (email: string) => {
  const urlSearchParam = new URLSearchParams()
  urlSearchParam.append("email", email)
  const querystring = urlSearchParam.toString()
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/passkey-without-auth?${querystring}`,
    {
      method: "GET",
      headers: {
        "x-publishable-api-key":
          process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
        "Content-Type": "application/json",
      },
    }
  )
  const data = await response.json()
  return data
}

export const retrieveCustomer =
  async (): Promise<HttpTypes.StoreCustomer | null> => {
    const authHeaders = await getAuthHeaders()

    if (!authHeaders) return null

    const headers = {
      ...authHeaders,
    }

    const next = {
      ...(await getCacheOptions("customers")),
    }

    return await sdk.client
      .fetch<{ customer: HttpTypes.StoreCustomer }>(`/store/customers/me`, {
        method: "GET",
        query: {
          fields: "*orders",
        },
        headers,
        next,
        cache: "force-cache",
      })
      .then(({ customer }) => customer)
      .catch(() => null)
  }

export const updateCustomer = async (body: HttpTypes.StoreUpdateCustomer) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const updateRes = await sdk.store.customer
    .update(body, {}, headers)
    .then(({ customer }) => customer)
    .catch(medusaError)

  const cacheTag = await getCacheTag("customers")
  revalidateTag(cacheTag)

  return updateRes
}

export async function signup(_currentState: unknown, formData: FormData) {
  const password = formData.get("password") as string
  const customerForm = {
    email: formData.get("email") as string,
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    phone: formData.get("phone") as string,
  }

  try {
    const token = await sdk.auth.register("customer", "emailpass", {
      email: customerForm.email,
      password: password,
    })

    await setAuthToken(token as string)

    const headers = {
      ...(await getAuthHeaders()),
    }

    const { customer: createdCustomer } = await sdk.store.customer.create(
      customerForm,
      {},
      headers
    )

    const loginToken = await sdk.auth.login("customer", "emailpass", {
      email: customerForm.email,
      password,
    })

    await setAuthToken(loginToken as string)

    const customerCacheTag = await getCacheTag("customers")
    revalidateTag(customerCacheTag)

    await transferCart()

    return createdCustomer
  } catch (error: any) {
    return error.toString()
  }
}

export async function login(_currentState: unknown, formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  try {
    await sdk.auth
      .login("customer", "emailpass", { email, password })
      .then(async (token) => {
        await setAuthToken(token as string)
        const customerCacheTag = await getCacheTag("customers")
        revalidateTag(customerCacheTag)
      })
  } catch (error: any) {
    return error.toString()
  }

  try {
    await transferCart()
  } catch (error: any) {
    return error.toString()
  }
}

export async function signout(countryCode: string) {
  await sdk.auth.logout()

  await removeAuthToken()

  const customerCacheTag = await getCacheTag("customers")
  revalidateTag(customerCacheTag)

  await removeCartId()

  const cartCacheTag = await getCacheTag("carts")
  revalidateTag(cartCacheTag)

  redirect(`/${countryCode}/account`)
}

export async function transferCart() {
  const cartId = await getCartId()

  if (!cartId) {
    return
  }

  const headers = await getAuthHeaders()

  await sdk.store.cart.transferCart(cartId, {}, headers)

  const cartCacheTag = await getCacheTag("carts")
  revalidateTag(cartCacheTag)
}

export const addCustomerAddress = async (
  currentState: Record<string, unknown>,
  formData: FormData
): Promise<any> => {
  const isDefaultBilling = (currentState.isDefaultBilling as boolean) || false
  const isDefaultShipping = (currentState.isDefaultShipping as boolean) || false

  const address = {
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    company: formData.get("company") as string,
    address_1: formData.get("address_1") as string,
    address_2: formData.get("address_2") as string,
    city: formData.get("city") as string,
    postal_code: formData.get("postal_code") as string,
    province: formData.get("province") as string,
    country_code: formData.get("country_code") as string,
    phone: formData.get("phone") as string,
    is_default_billing: isDefaultBilling,
    is_default_shipping: isDefaultShipping,
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.store.customer
    .createAddress(address, {}, headers)
    .then(async ({ customer }) => {
      const customerCacheTag = await getCacheTag("customers")
      revalidateTag(customerCacheTag)
      return { success: true, error: null }
    })
    .catch((err) => {
      return { success: false, error: err.toString() }
    })
}

export const deleteCustomerAddress = async (
  addressId: string
): Promise<void> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  await sdk.store.customer
    .deleteAddress(addressId, headers)
    .then(async () => {
      const customerCacheTag = await getCacheTag("customers")
      revalidateTag(customerCacheTag)
      return { success: true, error: null }
    })
    .catch((err) => {
      return { success: false, error: err.toString() }
    })
}

export const updateCustomerAddress = async (
  currentState: Record<string, unknown>,
  formData: FormData
): Promise<any> => {
  const addressId =
    (currentState.addressId as string) || (formData.get("addressId") as string)

  if (!addressId) {
    return { success: false, error: "Address ID is required" }
  }

  const address = {
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    company: formData.get("company") as string,
    address_1: formData.get("address_1") as string,
    address_2: formData.get("address_2") as string,
    city: formData.get("city") as string,
    postal_code: formData.get("postal_code") as string,
    province: formData.get("province") as string,
    country_code: formData.get("country_code") as string,
  } as HttpTypes.StoreUpdateCustomerAddress

  const phone = formData.get("phone") as string

  if (phone) {
    address.phone = phone
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.store.customer
    .updateAddress(addressId, address, {}, headers)
    .then(async () => {
      const customerCacheTag = await getCacheTag("customers")
      revalidateTag(customerCacheTag)
      return { success: true, error: null }
    })
    .catch((err) => {
      return { success: false, error: err.toString() }
    })
}
