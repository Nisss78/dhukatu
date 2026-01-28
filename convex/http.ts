import { fetchQuery } from "convex/nextjs";
import { api } from "./_generated/server";

export async function GET() {
  const data = await fetchQuery(api.getDeadlines, {});
  return Response.json(data);
}
