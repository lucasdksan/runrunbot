import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { Context, Modal, ModalContext, SlashCommand, SlashCommandContext } from "necord";
import { CreateReminder } from "../application/usecases/create-reminder.usecase";
import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { plainToInstance } from "class-transformer";
import { CreateReminderDto } from "./dtos/create-reminder.dto";
import { validate } from "class-validator";
import { ListReminder } from "../application/usecases/list-reminder.usecase";
import { ListReminderDto } from "./dtos/list-reminder.dto";

@Injectable()
export class ReminderCommands {
    @Inject(CreateReminder.Usecase)
    private createReminderUsecase: CreateReminder.Usecase;

    @Inject(ListReminder.Usecase)
    private listReminderUsecase: ListReminder.Usecase;

    @SlashCommand({
        name: "register_reminder",
        description: "Modal register reminder",
    })
    public async register(@Context() [interaction]: SlashCommandContext) {
        const messageInput = new TextInputBuilder()
            .setCustomId("message")
            .setLabel("Mensagem do lembrete")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

        const remindAtInput = new TextInputBuilder()
            .setCustomId("remindAt")
            .setLabel("Data e hora (YYYY-MM-DD HH:MM)")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const modal = new ModalBuilder()
            .setCustomId("register/reminder")
            .setTitle("Registrar lembrete")
            .addComponents(
                new ActionRowBuilder<TextInputBuilder>().addComponents(messageInput),
                new ActionRowBuilder<TextInputBuilder>().addComponents(remindAtInput)
            );

        return interaction.showModal(modal);
    }

    @Modal("register/reminder")
    protected async registerModal(@Context() [interaction]: ModalContext) {
        try {
            const discordUser = interaction.user.username;
            const message = interaction.fields.getTextInputValue("message");
            const remindAtInput = interaction.fields.getTextInputValue("remindAt");
            const remindAt = new Date(remindAtInput.replace(" ", "T"));
            const dto = plainToInstance(CreateReminderDto, {
                discordUser,
                message,
                remindAt
            });
            const errors = await validate(dto);

            if (errors.length > 0) {
                throw new BadRequestException("Dados inválidos no formulário.");
            }

            await this.createReminderUsecase.execute(dto);

            return interaction.reply({
                content: "Lembrete registrado com sucesso!",
                flags: 1 << 6,
            });
        } catch (error) {
            console.error("Error: ", error);

            return interaction.reply({
                content: "Erro ao registrar lembrete.",
                flags: 1 << 6,
            });
        }
    }

    @SlashCommand({
        name: "list_reminder",
        description: "List all reminders",
    })
    public async reminders(@Context() [interaction]: SlashCommandContext){
        try {
            const discordUser = interaction.user.username;
            const dto = plainToInstance(ListReminderDto, {
                discordUser,
            });
            const errors = await validate(dto);

            if (errors.length > 0) {
                throw new BadRequestException("Dados inválidos no formulário.");
            }

            let print = "";
            const list = await this.listReminderUsecase.execute(dto);

            list.forEach((reminder) => {
                const remindDate = new Date(reminder.remindAt);
                const remindString = `${remindDate.getDate()}/${remindDate.getMonth()+1}/${remindDate.getFullYear()}`;
                
                print = `${print} * ${remindString} - mensagem: ${reminder.message}\n`;
            });

            return interaction.reply({
                content: list.length === 0 ? "Você não possui lembretes" : `Seus lembretes:\n${print}`,
                flags: 1 << 6,
            });
        } catch (error) {
            return interaction.reply({
                content: "Erro ao listar seus lembretes.",
                flags: 1 << 6,
            });
        }
    }
}