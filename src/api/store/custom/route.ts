import {
  AuthenticatedMedusaRequest,
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const query = req.scope.resolve("query");

    const { data } = await query.graph({
      entity: "payment"!,
      fields: ["*", "*.*"],
    });
    res.json(data);
  } catch (error) {
    res.json(error).status(500);
  }
}

export const POST = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  console.log("Received POST request");
  console.log("Request body:", req.body);

  const { phone, email } = req.body as any;

  console.log("phone", phone);

  res.send("OK");
};
