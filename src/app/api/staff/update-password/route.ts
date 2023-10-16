import { NextResponse } from "next/server";
import bcrypt, { compare } from "bcryptjs";
import { updatePassword, userValidation } from "../staff-db-api";

export async function PUT(request: Request) {
  const { userId, oldpassword, newpassword } = await request.json();

  let res;
  try {
    const user = await userValidation(userId);
    const passwordsMatch = await compare(oldpassword, user[0].password);

    if (passwordsMatch) {
      const hashedPassword = await bcrypt.hash(newpassword, 10);
      await updatePassword(hashedPassword, userId);
      res = { message: "SUCCESS" };
    } else {
      res = { message: "INCORRECT_OLD" };
    }
  } catch (error) {
    console.error("Error updating staff password:", error);
    res = { message: "FAIL" };
  }
  return NextResponse.json(res);
}
