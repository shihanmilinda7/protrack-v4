import { NextResponse } from "next/server";
import { getSearchProjectCount, getSearchProjectData } from "./project-db-api";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let res;

  const tmpPageNumber: any = searchParams.get("page-number");
  const tmpSearchProjectName: any = searchParams.get("search-project-name");
  const currentPage: any = parseInt(tmpPageNumber);

  const postsPerPage = 10; // Number of posts per page
  const offset = (currentPage - 1) * postsPerPage;
  let totalProjectCount: any;
  let project: any;

  let searchProjectName: any;
  if (tmpSearchProjectName == "-1") {
    searchProjectName = "";
  } else {
    searchProjectName = tmpSearchProjectName;
  }
  try {
    totalProjectCount = await getSearchProjectCount(searchProjectName);
    project = await getSearchProjectData(
      searchProjectName,
      postsPerPage,
      offset
    );
    res = { message: "SUCCESS", project, totalProjectCount };
  } catch (error) {
    console.log("error", error);
    res = { message: "FAIL" };
  }

  return NextResponse.json(res);
}
