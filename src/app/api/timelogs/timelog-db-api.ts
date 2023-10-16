import { db } from "@/db";

export const getTimelogAsYearMonth = async (date, staffid) => {
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
      }
    } catch (error) {
      console.error("Transaction error:", error);
    }
  });
  transaction();
  return timelogData;
};

export const getTimelogDetails = async (staffid, date) => {
  let timelogHeaderData;
  let timelogDetailData;
  const transaction = db.transaction(() => {
    try {
      const query1 = `SELECT *
      FROM timelogs
      WHERE staffid = ? AND date = ?;`;
      timelogHeaderData = db.prepare(query1).all(staffid, date);

      if (timelogHeaderData.length > 0) {
        const query2 = `SELECT *
        FROM timelogsdetails
        WHERE timelogid = ?;`;
        timelogDetailData = db
          .prepare(query2)
          .all(timelogHeaderData[0].timelogid);
      } else {
        timelogHeaderData = [];
        timelogDetailData = [];
      }
    } catch (error) {
      console.error("Transaction error:", error);
    }
  });
  transaction();
  return { timelogHeaderData, timelogDetailData };
};

export const updateTimelog = async (
  timelogid,
  staffid,
  date,
  remark,
  workingType,
  timelogRows
) => {
  let rows;
  let headerId = timelogid;

  const transaction = db.transaction(() => {
    try {
      if (timelogid) {
        const query1 = `UPDATE timelogs
        SET
          remark = ?,
          workingType = ?
        WHERE timelogid = ?;`;

        db.prepare(query1).run(remark, workingType, timelogid);
      } else {
        const query2 = `INSERT INTO timelogs (staffid, date, remark, workingType)
        VALUES (?, ?, ?, ?);`;

        const timelogHeader = db
          .prepare(query2)
          .run(staffid, date, remark, workingType);
        headerId = timelogHeader.lastInsertRowid;
      }

      for (let i = 0; i < timelogRows.length; i++) {
        const element = timelogRows[i];
        if (element.rowstatus == "u") {
          const query3 = `UPDATE timelogsdetails
          SET
            rowindex = ?,
            projectid = ?,
            taskid = ?,
            time = ?,
            remark = ?
          WHERE timelogdetailid = ?;`;

          db.prepare(query3).run(
            i + 1,
            element.projectid,
            element.taskid,
            element.time,
            element.remark,
            parseInt(element.timelogdetailid)
          );
        } else if (element.rowstatus == "a") {
          const query4 = `INSERT INTO timelogsdetails (timelogid, rowindex, projectid, taskid, time, remark)
          VALUES (?, ?, ?, ?, ?, ?);`;

          db.prepare(query4).run(
            headerId,
            i + 1,
            element.projectid,
            element.taskid,
            element.time,
            element.remark
          );
        } else if (element.rowstatus == "d") {
          const query5 = `DELETE FROM timelogsdetails
          WHERE timelogdetailid = ?;`;

          db.prepare(query5).run(element.timelogdetailid);
        }
      }

      const isAnyTimelogRow: any = timelogRows.find(
        (t: any) => t.rowstatus == "a" || t.rowstatus == "u"
      );
      if (!isAnyTimelogRow) {
        const query5 = `DELETE FROM timelogs
        WHERE timelogid = ?;`;
        db.prepare(query5).run(timelogid);
      }
    } catch (error) {
      console.error("Transaction error:", error);
    }
  });
  transaction();
  return rows;
};
