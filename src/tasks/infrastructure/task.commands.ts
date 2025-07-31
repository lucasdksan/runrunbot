import { Inject, Injectable } from "@nestjs/common";
import { Message } from "discord.js";
import { Context, On } from "necord";
import { StartWork } from "../application/usecases/start-work.usecase";
import { EndWork } from "../application/usecases/end-work.usecase";

@Injectable()
export class TaskCommands {
    @Inject(StartWork.Usecase)
    private startWorkUsecase: StartWork.Usecase;

    @Inject(EndWork.Usecase)
    private endWorkUsecase: EndWork.Usecase;

    @On("messageCreate")
    public async onStartWork(@Context() [message]: [Message]) {
        if (message.author.bot) return;

        if (message.content.toLowerCase() === "bom dia" || message.content.toLowerCase() === "iniciando") {
            try {
                const discordUser = message.author.username;

                await message.react("✅");

                const { message: response } = await this.startWorkUsecase.execute({ discordUser });

                await message.author.send(response);
            } catch (err) {
                console.error(`Não consegui enviar DM para ${message.author.tag}:`, err);
            }
        }
    }

    @On("messageCreate")
    public async onEndWork(@Context() [message]: [Message]) {
        if (message.author.bot) return;

        if (message.content.toLowerCase() === "encerrando" || message.content.toLowerCase() === "almoço") {
            try {
                const discordUser = message.author.username;

                await message.react("✅");

                const { message: response } = await this.endWorkUsecase.execute({ discordUser, userInput: message.content });

                await message.author.send(response);
            } catch (err) {
                console.error(`Não consegui enviar DM para ${message.author.tag}:`, err);
            }
        }
    }
}