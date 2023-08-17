import { InlineKeyboard } from "grammy";
import { getAllTickets } from "#root/bot/database.js";
import type { Context } from "#root/bot/context.js";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
function createTicketsKeyboard(rows: never[]): InlineKeyboard {
  const keyboard = new InlineKeyboard();

  // eslint-disable-next-line no-restricted-syntax
  for (const row of rows) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    keyboard.text(row.details, `ticket-${row.id}`).row();
  }

  return keyboard;
}

export function showTickets(ctx: Context) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  getAllTickets((error: string | undefined, rows: never[]) => {
    if (error) {
      ctx.editMessageText("Произошла ошибка при получении билетов.");
      return;
    }

    if (rows.length === 0) {
      ctx.reply("Пока нет доступных билетов.");
      return;
    }

    ctx.editMessageText("Доступные билеты:", {
      reply_markup: createTicketsKeyboard(rows),
    });
  });
}
//
// composer.on("callback_query", () => {
//   const data = ctx.callbackQuery?.data;
//   if (data?.startsWith("ticket-")) {
//     getAllTickets((error: string | undefined, rows: any[]) => {
//       if (error) {
//         ctx.editMessageText("Произошла ошибка при получении билетов.");
//         return;
//       }
//
//       const ticketId = data.split("-")[1];
//       const ticket = rows.find(
//         (row) => row.id === Number.parseInt(ticketId, 10),
//       );
//
//       if (ticket) {
//         const userLink = `[${ticket.user_id}](tg://user?id=${ticket.user_id})`;
//         const contactKeyboard = new InlineKeyboard().url(
//           "Связаться с продавцом",
//           `tg://user?id=${ticket.user_id}`,
//         );
//         ctx.editMessageText(
//           `Билет: ${ticket.details}\n\nДобавлен пользователем: ${userLink}`,
//           { parse_mode: "Markdown", reply_markup: contactKeyboard },
//         );
//       } else {
//         ctx.editMessageText("Билет не найден.");
//       }
//     });
//   }
// });
