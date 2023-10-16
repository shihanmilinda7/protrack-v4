import { NextResponse } from "next/server";
import { getAllStaffCount } from "../../staff/staff-db-api";

export async function GET(request: Request) {
  let res;

  let totalStaffCount: any;

  try {
    totalStaffCount = await getAllStaffCount();

    res = { message: "SUCCESS", totalStaffCount };
  } catch (error) {
    console.log("error", error);
    res = { message: "FAIL" };
  }

  return NextResponse.json(res);
}
