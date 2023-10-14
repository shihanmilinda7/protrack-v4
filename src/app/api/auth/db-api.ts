import { db } from "@/db";

export const login = async (username) => {
  let rows;
  const transaction = db.transaction(() => {
    try {
      const query = `SELECT * FROM users WHERE username = ?;`;
      rows = db.prepare(query).all(username);
    } catch (error) {
      console.error("Transaction error:", error);
    }
  });
  transaction();
  return rows;
};
