import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import {
  deleteStaff,
  getAllStaffCount,
  getAllStaffData,
  newStaff,
  updateStaff,
} from "./staff-db-api";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let res;

  const tmpPageNumber: any = searchParams.get("page-number");
  const currentPage: any = parseInt(tmpPageNumber);
  const postsPerPage = 10; // Number of posts per page
  const offset = (currentPage - 1) * postsPerPage;

  try {
    const staff = await getAllStaffData(postsPerPage, offset);
    const staffCount = await getAllStaffCount();
    res = { message: "SUCCESS", staff, staffCount };
  } catch (error) {
    console.error("Error adding new staff:", error);
    res = { message: "FAIL" };
  }

  return NextResponse.json(res);
}

export async function POST(request: Request) {
  const {
    staffname,
    contracttype,
    contactno,
    nic,
    password,
    username,
    role,
    designation,
    country,
  } = await request.json();
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("hashedPassword", hashedPassword);
  let message: string = "SUCCESS";
  console.log("designation", designation);
  try {
    await newStaff(
      staffname,
      contracttype,
      contactno,
      nic,
      hashedPassword,
      username,
      role,
      designation,
      country
    );
  } catch (error) {
    console.error("Error adding new staff:", error);
    message = "FAIL";
  }
  return NextResponse.json(message);
}

export async function PUT(request: Request) {
  const {
    staffid,
    staffname,
    contracttype,
    contactno,
    nic,
    password,
    username,
    userid,
    role,
    designation,
    country,
  } = await request.json();
  const hashedPassword = await bcrypt.hash(password, 10);

  let message: string = "SUCCESS";
  try {
    await updateStaff(
      staffid,
      staffname,
      contracttype,
      contactno,
      nic,
      username,
      userid,
      role,
      designation,
      country
    );
  } catch (error) {
    console.error("Error updating staff:", error);
    message = "FAIL";
  }
  return NextResponse.json(message);
}

export async function DELETE(request: Request) {
  const { staffid, userid } = await request.json();
  let message: string = "SUCCESS";

  try {
    await deleteStaff(staffid, userid);
  } catch (error) {
    console.error("Error deleting staff:", error);
    message = "FAIL";
  }

  return NextResponse.json(message);
}
