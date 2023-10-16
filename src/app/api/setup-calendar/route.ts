import { NextResponse } from "next/server";
import {
  getDatasourceAsYearAndCountry,
  updateCalendarData,
} from "./setupcalendar-db-api";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let res;

  const tmpYear: any = searchParams.get("year");
  const tmpCountry: any = searchParams.get("country");

  try {
    const { headerData, dataSource } = await getDatasourceAsYearAndCountry(
      tmpYear,
      tmpCountry
    );
    res = { message: "SUCCESS", headerData, dataSource };
  } catch (error) {
    console.error("Error getting calander data source:", error);
    res = { message: "FAIL" };
  }

  return NextResponse.json(res);
}

export async function POST(request: Request) {
  const { calanderid, dataSource, year, country } = await request.json();
  let res;

  try {
    await updateCalendarData(calanderid, dataSource, year, country);
    res = { message: "SUCCESS" };
  } catch (error) {
    console.error("Error adding new calander:", error);
    res = { message: "FAIL" };
  }
  return NextResponse.json(res);
}
