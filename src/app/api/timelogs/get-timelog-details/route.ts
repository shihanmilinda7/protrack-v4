import { NextResponse } from "next/server";
import { getTimelogDetails } from "../timelog-db-api";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let res;

  const staffid: any = searchParams.get("staffid");
  const date: any = searchParams.get("sel-date");

  try {
    const { timelogHeaderData, timelogDetailData } = await getTimelogDetails(
      staffid,
      date
    );
    res = { message: "SUCCESS", timelogHeaderData, timelogDetailData };
  } catch (error) {
    console.error("Error getting timelog:", error);
    res = { message: "FAIL" };
  }

  return NextResponse.json(res);
}
