import AuthModule from "@medusajs/medusa/auth";
import { defineLink, DefineLinkExport } from "@medusajs/framework/utils";
import PasskeyCredentialsModule from "../modules/passkey-credentials";

let link: DefineLinkExport | null = null;

link = defineLink(AuthModule.linkable.authIdentity, {
  linkable: PasskeyCredentialsModule.linkable.passkeyCredentials,
  isList: true,
});

export default link;
