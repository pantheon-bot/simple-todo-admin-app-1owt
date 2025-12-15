"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  ADMIN_PASSWORD,
  clearAdminSession,
  startAdminSession,
} from "@/lib/admin";

export async function loginAdmin(formData: FormData) {
  const password = formData.get("password");

  if (typeof password !== "string" || password.length === 0) {
    redirect("/admin?error=missing");
  }

  if (password !== ADMIN_PASSWORD) {
    redirect("/admin?error=invalid");
  }

  await startAdminSession();
  revalidatePath("/admin");
  redirect("/admin");
}

export async function logoutAdmin() {
  await clearAdminSession();
  revalidatePath("/admin");
  redirect("/admin");
}
