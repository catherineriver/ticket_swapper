import sqlite3 from "sqlite3";

const database = new sqlite3.Database("tickets.db");

export function init() {
  database.run(
    `CREATE TABLE IF NOT EXISTS tickets (
        id INTEGER PRIMARY KEY,
        user_id INTEGER,
        details TEXT
    )`,
    (error) => {
      if (error) {
        // eslint-disable-next-line no-console
        console.error("Ошибка при создании таблицы:", error);
      } else {
        // eslint-disable-next-line no-console
        console.log("Таблица успешно создана или уже существует");
      }
    },
  );
}

export function addTicketToDatabase(
  userId: number,
  details: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    database.run(
      "INSERT INTO tickets (user_id, details) VALUES (?, ?)",
      [userId, details],
      (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      },
    );
  });
}

export function getAllTickets(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  callback: (error: string | undefined, rows: never[]) => void,
) {
  database.all(
    "SELECT id, user_id, details FROM tickets",
    [],
    (error, rows) => {
      if (error) {
        // eslint-disable-next-line no-console
        console.error("Ошибка при извлечении билетов:", error);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        callback(error);
      } else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        callback(undefined, rows);
      }
    },
  );
}
