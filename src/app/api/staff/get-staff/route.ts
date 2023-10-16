import { NextResponse } from "next/server";
import { getSearchStaffCount, getSearchStaffData } from "../staff-db-api";
import {
  getStaffAssignProject,
  getStaffAssignTask,
} from "../../project-assign/projectassign-db-api";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let res;

  const tmpPageNumber: any = searchParams.get("page-number");
  const tmpSearchStaffName: any = searchParams.get("search-staff-name");
  const tmpSearchDesignation: any = searchParams.get("search-designation");
  const projectid: any = searchParams.get("projectid");
  const currentPage: any = parseInt(tmpPageNumber);

  const postsPerPage = 10; // Number of posts per page
  const offset = (currentPage - 1) * postsPerPage;

  let totalStaffCount: any;
  let staff: any;
  let searchStaffName: any;
  let searchDesignation: any;

  try {
    if (tmpSearchStaffName == "-1") {
      searchStaffName = "";
    } else {
      searchStaffName = tmpSearchStaffName;
    }

    if (tmpSearchDesignation == "-1") {
      searchDesignation = "";
    } else {
      searchDesignation = tmpSearchDesignation;
    }

    totalStaffCount = await getSearchStaffCount(
      searchStaffName,
      searchDesignation
    );
    staff = await getSearchStaffData(
      searchStaffName,
      searchDesignation,
      postsPerPage,
      offset
    );
    if (staff.length > 0) {
      for (let index = 0; index < staff.length; index++) {
        const element = staff[index];

        const projectTasks: any = await getStaffAssignTask(
          projectid,
          element.staffid
        );
        element["assigntasks"] = projectTasks;

        const projects: any = await getStaffAssignProject(element.staffid);
        element["assignprojects"] = projects;
      }
      res = { message: "SUCCESS", staff, totalStaffCount };
    } else {
      res = { message: "FAIL", staff: [], totalStaffCount: 1 };
    }
  } catch (error) {
    console.log("error", error);
    res = { message: "FAIL" };
  }

  return NextResponse.json(res);
}
