import { NextResponse } from "next/server";
import { getAllProjectCount } from "../../project/project-db-api";

export async function GET(request: Request) {
  let res;

  let totalProjectCount: any;

  try {
    totalProjectCount = await getAllProjectCount();
    res = { message: "SUCCESS", totalProjectCount };
  } catch (error) {
    console.log("error", error);
    res = { message: "FAIL" };
  }

  return NextResponse.json(res);
}
