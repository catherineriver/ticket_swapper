import type { Context } from "#root/bot/context.js";

const userStates: Record<number, string> = {};

export function addTicket(ctx: Context) {
  const userId = ctx.from?.id;
  if (userId) {
    userStates[userId] = "awaiting_concert_name";
    ctx.reply("Введите название концерта:");
  }
}
