import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ cookies, redirect }) => {
  cookies.delete("user-id", { path: "/" });
  return redirect("/login");
};