import { NextResponse } from "next/server";
import { getCountries, getYears } from "../setupcalendar-db-api";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let res;

  try {
    const years = await getYears();
    const countries = await getCountries();

    if (years.length > 0) {
      res = { message: "SUCCESS", years, countries };
    } else {
      res = { message: "SUCCESS", years: [], countries: [] };
    }
  } catch (error) {
    console.error("Error getting calander data source:", error);
    res = { message: "FAIL" };
  }

  return NextResponse.json(res);
}
