import { NextResponse } from "next/server";
import { getStaffAssignTask } from "../../project-assign/projectassign-db-api";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let res;

  const staffid: any = searchParams.get("staffid");
  const projectid: any = searchParams.get("projectid");

  const projectTasks = await getStaffAssignTask(projectid, staffid);
  res = { message: "SUCCESS", projectTasks };

  return NextResponse.json(res);
}
