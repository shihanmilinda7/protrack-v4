import { NextResponse } from "next/server";
import { getStaffAssignProject } from "../../project-assign/projectassign-db-api";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let res;

  const staffid: any = searchParams.get("staffid");

  let project: any;
  project = await getStaffAssignProject(staffid);

  if (project.length > 0) {
    res = { message: "SUCCESS", project };
  } else {
    res = { message: "FAIL" };
  }
  return NextResponse.json(res);
}
