import { db } from "@/db";

export const getYears = async () => {
  let rows;
  const transaction = db.transaction(() => {
    try {
      const query = `SELECT DISTINCT year
        FROM calanderheaderdata
        ORDER BY year ASC;`;

      rows = db.prepare(query).all();
    } catch (error) {
      console.error("Transaction error:", error);
    }
  });
  transaction();
  return rows;
};

export const getCountries = async () => {
  let rows;
  const transaction = db.transaction(() => {
    try {
      const query = `SELECT DISTINCT country
      FROM calanderheaderdata
      ORDER BY country ASC;`;

      rows = db.prepare(query).all();
    } catch (error) {
      console.error("Transaction error:", error);
    }
  });
  transaction();
  return rows;
};

export const getDatasourceAsYearAndCountry = async (year, country) => {
  let headerData;
  let dataSource;
  const transaction = db.transaction(() => {
    try {
      const query1 = `SELECT *
      FROM calanderheaderdata
      WHERE year = ? AND country = ?;`;
      headerData = db.prepare(query1).all(year, country);

      if (headerData.length > 0) {
        const query2 = `SELECT *
        FROM calanderdatasourcedata
        WHERE calanderid = ?;`;
        dataSource = db
          .prepare(query2)
          .all(headerData[0].calanderid.toString());
      } else {
        dataSource = [];
      }
    } catch (error) {
      console.error("Transaction error:", error);
    }
  });
  transaction();
  return { headerData, dataSource };
};

export const getDatasourceAsYearMonthAndCountry = async (
  year,
  month,
  country
) => {
  let headerData;
  let dataSource;
  const transaction = db.transaction(() => {
    try {
      const query1 = `SELECT *
      FROM calanderheaderdata
      WHERE year = ? AND country = ?;`;
      headerData = db.prepare(query1).all(year, country);

      if (headerData.length > 0) {
        const query2 = `SELECT *
        FROM calanderdatasourcedata
        WHERE calanderid = ? AND uniqueKey LIKE ?;`;
        dataSource = db
          .prepare(query2)
          .all(headerData[0].calanderid.toString(), `${month}%`);
      } else {
        dataSource = [];
      }
    } catch (error) {
      console.error("Transaction error:", error);
    }
  });
  transaction();
  return { headerData, dataSource };
};

export const updateCalendarData = async (
  calanderid,
  dataSource,
  year,
  country
) => {
  let rows;
  const transaction = db.transaction(() => {
    try {
      const query1 = `SELECT * 
        FROM calanderheaderdata
        WHERE year = ? AND country = ?;`;

      const dataExists = db.prepare(query1).all(year, country);
      if (dataExists.length > 0) {
        const query2 = `DELETE FROM calanderdatasourcedata
        WHERE calanderid = ?;`;
        db.prepare(query2).run(calanderid.toString());

        for (let i = 0; i < dataSource.length; i++) {
          const element = dataSource[i];
          const query3 = `INSERT INTO calanderdatasourcedata (calanderid, name, location, startDate, endDate, color, uniqueKey, dateType)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?);`;

          db.prepare(query3).run(
            calanderid.toString(),
            element.name,
            element.location,
            element.startDate,
            element.endDate,
            element.color,
            element.uniqueKey,
            element.dateType
          );
        }
      } else {
        const query4 = `INSERT INTO calanderheaderdata (year, country)
        VALUES (?, ?);`;
        const response = db.prepare(query4).run(year.toString(), country);
        if (response?.lastInsertRowid) {
          for (let i = 0; i < dataSource.length; i++) {
            const element = dataSource[i];
            const query4 = `INSERT INTO calanderdatasourcedata (calanderid, name, location, startDate, endDate, color, uniqueKey, dateType)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?);`;

            db.prepare(query4).run(
              response.lastInsertRowid.toString(),
              element.name,
              element.location,
              element.startDate,
              element.endDate,
              element.color,
              element.uniqueKey,
              element.dateType
            );
          }
        }
      }
    } catch (error) {
      console.error("Transaction error:", error);
    }
  });
  transaction();
  return rows;
};
