import { NextResponse } from "next/server";
import { updateTimelog } from "./timelog-db-api";

export async function POST(request: Request) {
  const { timelogid, staffid, date, remark, workingType, timelogRows } =
    await request.json();
  let res;
  try {
    await updateTimelog(
      timelogid,
      staffid,
      date,
      remark,
      workingType,
      timelogRows
    );
    res = { message: "SUCCESS" };
  } catch (error) {
    console.error("Error adding timelog", error);
    res = { message: "FAIL" };
  }
  return NextResponse.json(res);
}
