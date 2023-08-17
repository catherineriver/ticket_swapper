import { Composer } from "grammy";
import sqlite3 from "sqlite3";
import type { Context } from "#root/bot/context.js";
import { logHandle } from "#root/bot/helpers/logging.js";

const { Database } = sqlite3;

const database = new Database("tickets.db");

const composer = new Composer<Context>();

const feature = composer.chatType("private");
interface Ticket {
  id: number;
  user_id: number;
  details: string;
}

feature.command("pick", logHandle("command-pick"), (ctx) => {
  if (!ctx.callbackQuery) {
    return; // Просто выйдите из обработчика, если callbackQuery не определен
  }

  const ticketId = ctx.callbackQuery.data;
  database.get(
    "SELECT id, user_id, details FROM tickets",
    [ticketId],
    (error, row: Ticket) => {
      if (error || !row) {
        ctx.reply("Произошла ошибка при выборе билета.");
        return;
      }

      ctx.editMessageText(
        `Вы выбрали билет: ${row.details}. Свяжитесь с владельцем для обмена.`,
      );
    },
  );
});

export { composer as pickFeature };
