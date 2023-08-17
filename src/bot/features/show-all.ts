import { Composer } from "grammy";
import type { Context } from "#root/bot/context.js";
import { logHandle } from "#root/bot/helpers/logging.js";

const composer = new Composer<Context>();

const feature = composer.chatType("private");

feature.command("show", logHandle("command-show"), (ctx) => {
  ctx.reply("Обработка команды /show...");
});

export { composer as showAllFeature };
