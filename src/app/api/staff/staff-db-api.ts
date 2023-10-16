import { db } from "@/db";
import bcrypt, { compare } from "bcryptjs";

export const getAllStaffData = async (postsPerPage, offset) => {
  let rows;
  const transaction = db.transaction(() => {
    try {
      const query = `SELECT s.*,u.userid,u.username,u.password,u.role FROM staff AS s JOIN users AS u ON s.staffid = u.staffid limit ${postsPerPage} offset ${offset};`;

      rows = db.prepare(query).all();
    } catch (error) {
      console.error("Transaction error:", error);
    }
  });
  transaction();
  return rows;
};

export const getAllStaffCount = async () => {
  let rows;
  const transaction = db.transaction(() => {
    try {
      const query = `SELECT COUNT(*) as count FROM staff;`;

      rows = db.prepare(query).get();
    } catch (error) {
      console.error("Transaction error:", error);
    }
  });
  transaction();
  return rows.count;
};

export const newStaff = async (
  staffname,
  contracttype,
  contactno,
  nic,
  hashedPassword,
  username,
  role,
  designation,
  country
) => {
  let rows;
  const transaction = db.transaction(() => {
    try {
      const currentTimestamp = new Date();
      const query1 = `INSERT INTO staff (staffname,
        contracttype,
        contactno,
        nic,
        designation,
        country,createdAt) VALUES (?,?,?,?,?,?,?);`;

      const staff = db
        .prepare(query1)
        .run(
          staffname,
          contracttype,
          contactno,
          nic,
          designation,
          country,
          currentTimestamp.toISOString()
        );

      const query2 = `INSERT INTO users (staffid,
            username,
            password,
            role,
            country,createdAt) VALUES (?,?,?,?,?,?);`;

      db.prepare(query2).run(
        staff.lastInsertRowid,
        username,
        hashedPassword,
        role,
        country,
        currentTimestamp.toISOString()
      );
    } catch (error) {
      console.error("Transaction error:", error);
    }
  });
  transaction();
  return rows;
};

export const updateStaff = async (
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
) => {
  let rows;
  const transaction = db.transaction(() => {
    try {
      const query1 = `UPDATE staff SET staffname = ?,
      contracttype = ?,
      contactno = ?,
      nic = ?,
      designation = ?,
      country = ? WHERE staffid = ?;`;

      db.prepare(query1).run(
        staffname,
        contracttype,
        contactno,
        nic,
        designation,
        country,
        staffid
      );

      const query2 = `UPDATE users SET username = ?,
      country = ?,
      role = ?
      WHERE userid = ?;`;

      db.prepare(query2).run(username, country, role, userid);
    } catch (error) {
      console.error("Transaction error:", error);
    }
  });
  transaction();
  return rows;
};

export const deleteStaff = async (staffid, userid) => {
  let rows;
  const transaction = db.transaction(() => {
    try {
      const query1 = `DELETE FROM staff WHERE staffid = ?;`;

      db.prepare(query1).run(staffid);

      const query2 = `DELETE FROM users WHERE userid = ?;`;

      db.prepare(query2).run(userid);
    } catch (error) {
      console.error("Transaction error:", error);
    }
  });
  transaction();
  return rows;
};

export const usernameValidation = async (username, staffid) => {
  let rows;
  const transaction = db.transaction(() => {
    try {
      if (staffid == "0") {
        const query = `SELECT * FROM users WHERE username = ?;`;
        rows = db.prepare(query).all(username);
      } else {
        const query = `SELECT * FROM users WHERE staffid <> ? AND username = ?;`;
        rows = db.prepare(query).all(staffid, username);
      }
    } catch (error) {
      console.error("Transaction error:", error);
    }
  });
  transaction();
  return rows;
};

export const userValidation = async (userId) => {
  let rows;
  const transaction = db.transaction(() => {
    try {
      const query = `SELECT * FROM users WHERE userid = ?;`;
      rows = db.prepare(query).all(userId);
    } catch (error) {
      console.error("Transaction error:", error);
    }
  });
  transaction();
  return rows;
};

export const updatePassword = async (hashedPassword, userId) => {
  let rows;
  const transaction = db.transaction(() => {
    try {
      const query = `UPDATE users SET password = ? WHERE userid = ?;`;

      db.prepare(query).run(hashedPassword, userId);
    } catch (error) {
      console.error("Transaction error:", error);
    }
  });
  transaction();
  return rows;
};

export const getSearchStaffCount = async (
  searchStaffName,
  searchDesignation
) => {
  let rows;
  const transaction = db.transaction(() => {
    try {
      const query = `SELECT COUNT(*) as count FROM staff WHERE staffname LIKE ? AND designation LIKE ?;`;

      rows = db
        .prepare(query)
        .get(`%${searchStaffName}%`, `%${searchDesignation}%`);
    } catch (error) {
      console.error("Transaction error:", error);
    }
  });
  transaction();
  return rows.count;
};

export const getSearchStaffData = async (
  searchStaffName,
  searchDesignation,
  postsPerPage,
  offset
) => {
  let rows;
  const transaction = db.transaction(() => {
    try {
      const query = `SELECT * FROM staff
      WHERE staffname LIKE ? AND designation LIKE ?
      LIMIT ${postsPerPage} OFFSET ${offset};`;

      rows = db.prepare(query).all(`%${searchStaffName}%`, `%${searchDesignation}%`);
    } catch (error) {
      console.error("Transaction error:", error);
    }
  });
  transaction();
  return rows;
};

