import { NextResponse } from "next/server";
import {
  getSelectedStaffAssignTask,
  updateProjectAssign,
} from "./projectassign-db-api";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let res: any = { message: "SUCCESS" };

  const projectid: any = searchParams.get("projectid");
  const staffid: any = searchParams.get("staffid");

  try {
    const totalAssignTask = await getSelectedStaffAssignTask(
      projectid,
      staffid
    );
    res = { message: "SUCCESS", totalAssignTask };
  } catch (error) {
    console.error("Error getting project assign", error);
    res = { message: "SUCCESS" };
  }

  return NextResponse.json(res);
}

export async function POST(request: Request) {
  const { staffid, projectid, curPrjTaskRowOj } = await request.json();
  let message: string = "SUCCESS";

  try {
    await updateProjectAssign(staffid, projectid, curPrjTaskRowOj);
  } catch (error) {
    console.error("Error adding new assign", error);
    message = "FAIL";
  }
  return NextResponse.json(message);
}
