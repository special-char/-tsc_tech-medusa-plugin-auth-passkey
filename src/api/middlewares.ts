// import { vendorCors } from "./vendors/cors";
import {
  authenticate,
  defineMiddlewares,
  MiddlewareRoute,
} from "@medusajs/framework";

const passkeyRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/store/passkey",
    method: "GET",
    middlewares: [authenticate("customer", ["session", "bearer"])],
  },
  {
    matcher: "/store/customer-has-passkey",
    method: "GET",
    middlewares: [authenticate("customer", ["session", "bearer"])],
  },
  {
    matcher: "/store/auth",
    method: "GET",
  },
  {
    matcher: "/store/custom",
    method: "POST",
  },
];

export default defineMiddlewares([]);
