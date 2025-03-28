<p align="center">
  <a href="https://www.medusajs.com">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/59018053/229103275-b5e482bb-4601-46e6-8142-244f531cebdb.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg">
    <img alt="Medusa logo" src="https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg">
    </picture>
  </a>
</p>
<h1 align="center">
  Medusa Plugin
</h1>


<p align="center">
  Building blocks for digital commerce
</p>
<p align="center">
  <a href="https://github.com/medusajs/medusa/blob/master/CONTRIBUTING.md">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat" alt="PRs welcome!" />
  </a>
</p>

## Compatibility

This starter is compatible with versions >= 2.4.0 of `@medusajs/medusa`. 

## @tsc_tech/medusa-plugin-auth-passkey

This plugin allows users to register through email and mobile number using OTP. After registration, users are prompted to add a passkey. For already registered users, the generated passkey can be used to log in. If a user does not add a passkey during registration, they can add it later from the account section.


## Usage

1. **Registration**:
   - Users can register using their email or mobile number.
   - An OTP will be sent to the provided email or mobile number for verification.
   - After successful verification, users will be prompted to add a passkey.

2. **Login**:
   - Registered users can log in using their email/mobile number and the generated passkey.
   - If a user did not add a passkey during registration, they can add it later from their account section.

3. **Adding Passkey**:
   - Users can navigate to the account section to add or update their passkey at any time.
   
   


## Installation

To install the `@tsc_tech/medusa-plugin-auth-passkey`, run the following command:

```
npm install @tsc_tech/medusa-plugin-auth-passkey
```
or
```
yarn add @tsc_tech/medusa-plugin-auth-passkey
```

Additionally, install the auth-plugin package:


```
npm install @simplewebauthn/server -D
npm install @simplewebauthn/types -D
```
or

```
yarn add @simplewebauthn/server -D
yarn add @simplewebauthn/types
```

## Configuration

Step 1: Update Medusa Configuration Modify your medusa-config.ts to include the auth provider:

```
import EmailPassAuthProvider from "@medusajs/medusa/auth-emailpass";


module.exports = defineConfig({
modules: [
  ...
    {
      resolve: "@medusajs/medusa/auth",
      options: {
        providers: [
          {
            resolve: EmailPassAuthProvider,
            id: "emailpass",
          },
          {
            resolve:
              "@tsc_tech/medusa-plugin-auth-passkey/providers/auth-passkey",
            id: "auth-passkey",
            options: {
              rpID: process.env.RP_ID,
              rpName: process.env.RP_NAME,
              enableHTTPS: process.env.ENABLE_HTTPS === "true" ? true : false,
            },
          },
          {
            resolve: "@tsc_tech/medusa-plugin-auth-passkey/providers/auth",
            id: "otp",
          },
        ],
      },
    },
  ...],
  plugins: [
    {
      resolve: "@tsc_tech/medusa-plugin-auth-passkey",
      options: {},
    },
    ],
})
```

Run migrations after installation

```
npx medusa db:migrate
```


Step 2. Set Up Environment Variables In your .env file, define the following variables:

```
RP_ID=localhost
RP_NAME=your-rp-name
FRONTEND_URL=http://localhost:8000  // your frontend url
```


Step 3: See the example (auth-passkey-storefront-example) to integrate with frontend (Medusa Starter Template).

## Features

Secure Authentication: Leverages passkeys for enhanced security.

OTP-based Verification: Ensures user identity with one-time passwords.

Seamless Integration: Easily integrates with Medusa’s authentication system.

Customizable: Environment variables allow configuration for different use cases.

Multi-Platform Support: Works with both email and mobile authentication.



## Troubleshooting

If you encounter issues while setting up the plugin, consider the following:

Database Migration Issues: Run npx medusa db:migrate again and ensure your database is correctly set up.

Environment Variables Not Loading: Check if .env is correctly configured and restart your Medusa server.

Passkey Not Prompting: Ensure HTTPS is enabled if running on a production server.


## Contribution

We welcome contributions to improve this plugin! If you have suggestions or find issues, feel free to submit a pull request or open an issue in the repository.