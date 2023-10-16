import { db } from "@/db";

export const getStaffAssignTask = async (projectid, staffid) => {
  let rows;
  const transaction = db.transaction(() => {
    try {
      const query = `select pt.taskid,pt.taskname from projecttasksassigns as pta join projecttasks as pt on pta.taskid = pt.taskid where pta.projectid = ${projectid} and pta.staffid = ${staffid};`;

      rows = db.prepare(query).all();
    } catch (error) {
      console.error("Transaction error:", error);
    }
  });
  transaction();
  return rows;
};

export const getStaffAssignProject = async (staffid) => {
  let rows;
  const transaction = db.transaction(() => {
    try {
      const query = `select pa.projectid,p.projectname from projectassigns as pa join projects as p on pa.projectid = p.projectid where pa.staffid = ${staffid};`;

      rows = db.prepare(query).all();
    } catch (error) {
      console.error("Transaction error:", error);
    }
  });
  transaction();
  return rows;
};

export const getTaskAssignStaff = async (taskid) => {
  let rows;
  const transaction = db.transaction(() => {
    try {
      const query = `select s.staffname from projecttasksassigns as pta join staff as s on pta.staffid = s.staffid where pta.taskid = ${taskid};`;

      rows = db.prepare(query).all();
    } catch (error) {
      console.error("Transaction error:", error);
    }
  });
  transaction();
  return rows;
};

export const getSelectedStaffAssignTask = async (projectid, staffid) => {
  let rows;
  const transaction = db.transaction(() => {
    try {
      const query = `SELECT * FROM projecttasksassigns
      WHERE projectid = ? AND staffid = ?;`;

      rows = db.prepare(query).all(projectid, staffid);
    } catch (error) {
      console.error("Transaction error:", error);
    }
  });
  transaction();
  return rows;
};

export const updateProjectAssign = async (
  staffid,
  projectid,
  curPrjTaskRowOj
) => {
  let rows;
  const transaction = db.transaction(() => {
    try {
      const query1 = `SELECT * FROM projectassigns
      WHERE staffid = ? AND projectid = ?;`;
      const projectassignCount = db.prepare(query1).all(staffid, projectid);

      if (projectassignCount.length == 0) {
        const query2 = `INSERT INTO projectassigns (staffid, projectid)
        VALUES (?, ?);`;
        db.prepare(query2).run(staffid, projectid);
      }

      for (let i = 0; i < curPrjTaskRowOj.length; i++) {
        const element = curPrjTaskRowOj[i];
        if (element.projecttaskassignid == 0 && element.selected) {
          const query3 = `INSERT INTO projecttasksassigns (staffid, projectid, taskid)
          VALUES (?, ?, ?);`;
          db.prepare(query3).run(staffid, projectid, element.taskid);
        } else if (element.projecttaskassignid != 0 && !element.selected) {
          const query4 = `DELETE FROM projecttasksassigns
          WHERE projecttaskassignid = ?;`;
          db.prepare(query4).run(element.projecttaskassignid);
        }
      }

      const isAnySelected: any = curPrjTaskRowOj.find(
        (t: any) => t.selected === true
      );
      if (!isAnySelected) {
        const query5 = `DELETE FROM projectassigns
        WHERE projectassignid = ?;`;
        db.prepare(query5).run(projectassignCount[0].projectassignid);
      }
    } catch (error) {
      console.error("Transaction error:", error);
    }
  });
  transaction();
  return rows;
};
