import { NextResponse } from "next/server";
import {
  deleteProject,
  getProjectHeaderData,
  getProjectTasks,
  newProject,
  updateProject,
} from "../project-db-api";
import { getTaskAssignStaff } from "../../project-assign/projectassign-db-api";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let res;

  const projectid: string = searchParams.get("projectid") ?? "";

  const project = await getProjectHeaderData(projectid);

  if (project.length > 0) {
    const projectTasks = await getProjectTasks(projectid);

    if (projectTasks.length > 0) {
      for (let index = 0; index < projectTasks.length; index++) {
        const element = projectTasks[index];
        const assignMembers: any = await getTaskAssignStaff(element.taskid);
        element["assignmembers"] = assignMembers;
      }
      res = { message: "SUCCESS", project, projectTasks };
    } else {
      res = { message: "FAIL" };
    }
  } else {
    res = { message: "FAIL" };
  }
  return NextResponse.json(res);
}

export async function POST(request: Request) {
  const {
    projectname,
    projectdescription,
    startdate,
    enddate,
    projectstatus,
    taskRowObjects,
  } = await request.json();
  let message: string = "SUCCESS";

  try {
    await newProject(
      projectname,
      projectdescription,
      startdate,
      enddate,
      projectstatus,
      taskRowObjects
    );
  } catch (error) {
    console.error("Error adding new project", error);
    message = "FAIL";
  }
  return NextResponse.json(message);
}

export async function PUT(request: Request) {
  const {
    projectid,
    projectname,
    projectdescription,
    startdate,
    enddate,
    projectstatus,
    taskRowObjects,
  } = await request.json();
  let message: string = "SUCCESS";
  try {
    await updateProject(
      projectid,
      projectname,
      projectdescription,
      startdate,
      enddate,
      projectstatus,
      taskRowObjects
    );
  } catch (error) {
    console.error("Error updating project tasks", error);
    message = "FAIL";
  }
  return NextResponse.json(message);
}

export async function DELETE(request: Request) {
  const { projectid } = await request.json();
  let message: string = "SUCCESS";

  try {
    await deleteProject(projectid);
  } catch (error) {
    console.error("Error deleting staff:", error);
    message = "FAIL";
  }

  return NextResponse.json(message);
}
