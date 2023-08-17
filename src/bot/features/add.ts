import { Composer } from "grammy";
import type { Context } from "#root/bot/context.js";
import { logHandle } from "#root/bot/helpers/logging.js";
import { addTicket } from "#root/bot/handlers/add-ticket.js";
import { addTicketToDatabase } from "#root/bot/database.js";

const userStates: Record<number, string> = {};

const composer = new Composer<Context>();

const addFeature = composer.chatType("private");

addFeature.command("add", logHandle("command-add"), addTicket);

composer.on("message", (ctx) => {
  const userId = ctx.from.id;
  const { text } = ctx.message;

  switch (userStates[userId]) {
    case "awaiting_concert_name": {
      userStates[userId] = "awaiting_date";
      if (text !== undefined) {
        ctx.session.concertName = text;
      }
      ctx.reply("Введите цену билета:");
      break;
    }

    case "awaiting_date": {
      userStates[userId] = "awaiting_price";
      if (text !== null && text !== undefined) {
        const date = new Date(text);
        if (Number.isNaN(date.getTime())) {
          ctx.reply(
            "Пожалуйста, введите корректную дату. Например: 2023-08-16",
          );
        } else {
          // Проверка на корректную дату
          // eslint-disable-next-line prefer-destructuring
          ctx.session.date = date.toISOString().split("T")[0]; // сохраняем дату в формате YYYY-MM-DD
          ctx.reply("Введите дату мероприятия:");
        }
      } else {
        ctx.reply("Пожалуйста, введите дату мероприятия.");
      }
      break;
    }

    case "awaiting_price": {
      userStates[userId] = "awaiting_purchase_method";
      if (text !== null && text !== undefined) {
        ctx.session.price = text;
      }
      ctx.reply("Как можно приобрести билет?");
      break;
    }

    case "awaiting_purchase_method": {
      if (text !== null && text !== undefined) {
        ctx.session.purchaseMethod = text;
      }
      const details = `${ctx.session.concertName}, Цена: ${ctx.session.price}, Способ покупки: ${ctx.session.purchaseMethod}`;
      addTicketToDatabase(userId, details)
        .then(() => {
          ctx.reply(`Билет добавлен. ${details} Спасибо!`);
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error("Ошибка при добавлении билета:", error);
        });

      delete userStates[userId];
      break;
    }

    default: {
      // Обработка других сообщений
      break;
    }
  }
});

export { composer as addFeature };
