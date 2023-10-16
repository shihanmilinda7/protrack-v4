import { db } from "@/db";

export const getAllProjectCount = async () => {
  let rows;
  const transaction = db.transaction(() => {
    try {
      const query = `SELECT COUNT(*) as count FROM projects;`;

      rows = db.prepare(query).get();
    } catch (error) {
      console.error("Transaction error:", error);
    }
  });
  transaction();
  return rows.count;
};

export const getSearchProjectCount = async (searchProjectName) => {
  let rows;
  const transaction = db.transaction(() => {
    try {
      const query = `SELECT COUNT(*) as count FROM projects WHERE projectname LIKE ?;`;

      rows = db.prepare(query).get(`%${searchProjectName}%`);
    } catch (error) {
      console.error("Transaction error:", error);
    }
  });
  transaction();
  return rows.count;
};

export const getSearchProjectData = async (
  searchProjectName,
  postsPerPage,
  offset
) => {
  let rows;
  const transaction = db.transaction(() => {
    try {
      const query = `SELECT * FROM projects
      WHERE projectname LIKE ? LIMIT ${postsPerPage} OFFSET ${offset};`;

      rows = db.prepare(query).all(`%${searchProjectName}%`);
    } catch (error) {
      console.error("Transaction error:", error);
    }
  });
  transaction();
  return rows;
};

export const getProjectHeaderData = async (projectid) => {
  let rows;
  const transaction = db.transaction(() => {
    try {
      const query = `SELECT * FROM projects WHERE projectid = ?;`;
      rows = db.prepare(query).all(projectid);
    } catch (error) {
      console.error("Transaction error:", error);
    }
  });
  transaction();
  return rows;
};

export const getProjectTasks = async (projectid) => {
  let rows;
  const transaction = db.transaction(() => {
    try {
      const query = `SELECT * FROM projecttasks WHERE projectid = ?;`;
      rows = db.prepare(query).all(projectid);
    } catch (error) {
      console.error("Transaction error:", error);
    }
  });
  transaction();
  return rows;
};

export const newProject = async (
  projectname,
  projectdescription,
  startdate,
  enddate,
  projectstatus,
  taskRowObjects
) => {
  let rows;
  const transaction = db.transaction(() => {
    try {
      const query1 = `INSERT INTO projects (projectname,
        projectdescription,
        startdate,
        enddate,
        projectstatus) VALUES (?,?,?,?,?);`;

      const project = db
        .prepare(query1)
        .run(
          projectname,
          projectdescription,
          startdate,
          enddate,
          projectstatus
        );
      // console.log("staff", project.lastInsertRowid);

      for (let i = 0; i < taskRowObjects.length; i++) {
        const element = taskRowObjects[i];
        const query2 = `INSERT INTO projecttasks (projectid,
          taskname,
          taskdescription,
          startdate,
          enddate) VALUES (?,?,?,?,?);`;

        db.prepare(query2).run(
          project.lastInsertRowid,
          element.taskname,
          element.taskdescription,
          element.startdate,
          element.enddate
        );
      }
    } catch (error) {
      console.error("Transaction error:", error);
    }
  });
  transaction();
  return rows;
};

export const updateProject = async (
  projectid,
  projectname,
  projectdescription,
  startdate,
  enddate,
  projectstatus,
  taskRowObjects
) => {
  let rows;
  const transaction = db.transaction(() => {
    try {
      const query1 = `UPDATE projects SET projectname = ?,
      projectdescription = ?,
      startdate = ?,
      enddate = ?,
      projectstatus = ? WHERE projectid = ?;`;

      db.prepare(query1).run(
        projectname,
        projectdescription,
        startdate,
        enddate,
        projectstatus,
        projectid
      );

      for (let i = 0; i < taskRowObjects.length; i++) {
        const element = taskRowObjects[i];
        if (element.rowStatus != "deleted") {
          if (element.taskid) {
            const query2 = `UPDATE projecttasks
            SET
              taskname = ?,
              taskdescription = ?,
              startdate = ?,
              enddate = ?
            WHERE taskid = ?;`;

            db.prepare(query2).run(
              element.taskname,
              element.taskdescription,
              element.startdate,
              element.enddate,
              element.taskid
            );
          } else {
            const query3 = `INSERT INTO projecttasks (projectid,
              taskname,
              taskdescription,
              startdate,
              enddate) VALUES (?,?,?,?,?);`;

            db.prepare(query3).run(
              projectid,
              element.taskname,
              element.taskdescription,
              element.startdate,
              element.enddate
            );
          }
        } else {
          const query4 = `DELETE FROM projecttasks WHERE taskid = ?;`;
          db.prepare(query4).run(element.taskid);
        }
      }
    } catch (error) {
      console.error("Transaction error:", error);
    }
  });
  transaction();
  return rows;
};

export const deleteProject = async (projectid) => {
  let rows;
  const transaction = db.transaction(() => {
    try {
      const query1 = `DELETE FROM projects WHERE projectid = ?;`;

      db.prepare(query1).run(projectid);

      const query2 = `DELETE FROM projecttasks WHERE projectid = ?;`;

      db.prepare(query2).run(projectid);
    } catch (error) {
      console.error("Transaction error:", error);
    }
  });
  transaction();
  return rows;
};

export const getProjectTaskCount = async (projectid) => {
  let rows;
  const transaction = db.transaction(() => {
    try {
      const query = `SELECT COUNT(*) as count FROM projecttasks WHERE projectid = ?;`;

      rows = db.prepare(query).get(projectid);
    } catch (error) {
      console.error("Transaction error:", error);
    }
  });
  transaction();
  return rows.count;
};
