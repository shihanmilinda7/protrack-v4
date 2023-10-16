import { NextResponse } from "next/server";
import { getTimelogAsYearMonth } from "../timelog-db-api";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let res;

  const tmpDate: any = searchParams.get("date");
  const tmpStaffid: any = searchParams.get("staffid");

  try {
    const timelogData = await getTimelogAsYearMonth(tmpDate, tmpStaffid);
    res = { message: "SUCCESS", timelogData };
  } catch (error) {
    console.error("Error getting timelog data source:", error);
    res = { message: "FAIL" };
  }

  return NextResponse.json(res);
}
