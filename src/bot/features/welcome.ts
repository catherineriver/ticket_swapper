import { Composer, InlineKeyboard } from "grammy";
import type { Context } from "#root/bot/context.js";
import { logHandle } from "#root/bot/helpers/logging.js";
import { showTickets } from "#root/bot/handlers/show-tickets.js";
import { addTicket } from "#root/bot/handlers/add-ticket.js";
import { getAllTickets } from "#root/bot/database.js";

const composer = new Composer<Context>();
const userStates: Record<number, string> = {};

const feature = composer.chatType("private");

function mainMenuKeyboard(): InlineKeyboard {
  return new InlineKeyboard()
    .text("Посмотреть билеты", "view_tickets")
    .text("Добавить билет", "add_ticket");
}

feature.command("start", logHandle("command-start"), (ctx) => {
  return ctx.reply(
    'Добро пожаловать в бота для обмена билетами! Используйте /add для добавления билета и /list для просмотра доступных билетов. "Выберите действие:",',
    {
      reply_markup: mainMenuKeyboard(),
    },
  );
});

composer.on("callback_query", (ctx) => {
  const userId = ctx.from?.id;
  const data = ctx.callbackQuery?.data;

  if (data === "view_tickets") {
    userStates[userId] = "viewing_tickets";
    showTickets(ctx);
  } else if (data === "add_ticket") {
    userStates[userId] = "adding_ticket";
    addTicket(ctx);
  } else if (
    data?.startsWith("ticket-") &&
    userStates[userId] === "viewing_tickets"
  ) {
    getAllTickets((error: string | undefined) => {
      if (error) {
        ctx.editMessageText("Произошла ошибка при получении билетов.");
      }
    });
  }
});

export { composer as welcomeFeature };
