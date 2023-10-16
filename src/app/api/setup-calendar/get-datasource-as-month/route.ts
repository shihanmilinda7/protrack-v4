import { NextResponse } from "next/server";
import { getDatasourceAsYearMonthAndCountry } from "../setupcalendar-db-api";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let res;

  const tmpYear: any = searchParams.get("year");
  const tmpMonth: any = searchParams.get("month");
  const tmpCountry: any = searchParams.get("country");

  try {
    const { headerData, dataSource } = await getDatasourceAsYearMonthAndCountry(
      tmpYear,
      tmpMonth,
      tmpCountry
    );
    res = { message: "SUCCESS", headerData, dataSource };
  } catch (error) {
    console.error("Error getting calander data source:", error);
    res = { message: "FAIL" };
  }

  return NextResponse.json(res);
}
