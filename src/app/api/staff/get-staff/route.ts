import { prisma } from "@/db";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

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
    // console.log("searchStaffName",searchStaffName,)
    await prisma.$transaction(async (tx) => {
      totalStaffCount = await tx.staff.count({
        where: {
          staffname: {
            contains: searchStaffName,
          },
          designation: {
            contains: searchDesignation,
          },
        },
      });

      staff = await tx.staff.findMany({
        where: {
          staffname: {
            contains: searchStaffName,
          },
          designation: {
            contains: searchDesignation,
          },
        },
        skip: offset,
        take: postsPerPage,
      });

      // console.log(staff);
      if (staff.length > 0) {
        for (let index = 0; index < staff.length; index++) {
          const element = staff[index];
          const rawQuery = Prisma.sql`select pt.taskname from projecttasksassigns as pta join projecttasks as pt on pta.taskid = pt.taskid where pta.projectid = ${projectid} and pta.staffid = ${element.staffid}`;
          const projectTasks: any = await tx.$queryRaw(rawQuery);
          element["assigntasks"] = projectTasks;

          const rawQuery1 = Prisma.sql`select p.projectname from projectassigns as pa join projects as p on pa.projectid = p.projectid where pa.staffid = ${element.staffid}`;
          const projects: any = await tx.$queryRaw(rawQuery1);
          element["assignprojects"] = projects;
        }
        // console.log(staff);
        res = { message: "SUCCESS", staff, totalStaffCount };
      } else {
        res = { message: "FAIL", staff: [], totalStaffCount: 1 };
      }
      return "";
    });
  } catch (error) {
    console.log("error", error);
    res = { message: "FAIL" };
  }

  return NextResponse.json(res);
}
