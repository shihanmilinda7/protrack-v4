import { db } from "@/db";

export const getTimelogAsYearMonthForReport = async (date, staffid) => {
  let timelogData;
  const transaction = db.transaction(() => {
    try {
      const query1 = `SELECT *
      FROM timelogs
      WHERE staffid = ? AND date LIKE ?;`;
      timelogData = db.prepare(query1).all(staffid, `${date}%`);

      for (let i = 0; i < timelogData.length; i++) {
        const element = timelogData[i];
        const query2 = `SELECT sum(td.time) as totaltime FROM timelogsdetails as td  where td.timelogid = ${element.timelogid};`;
        const detailData = db.prepare(query2).all();
        element["totalHours"] = detailData[0]?.totaltime?.toString() ?? "0";

        const query3 = `SELECT p.projectname,pt.taskname,td.* FROM timelogsdetails as td left join projects as p on td.projectid = p.projectid left join projecttasks as pt on td.taskid = pt.taskid where td.timelogid = ${element.timelogid};`;
        const detailData1 = db.prepare(query3).all();
        element["taskdetails"] = detailData1;
      }
    } catch (error) {
      console.error("Transaction error:", error);
    }
  });
  transaction();
  return timelogData;
};
