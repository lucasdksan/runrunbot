import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { Context, Modal, ModalContext, SlashCommand, SlashCommandContext } from "necord";
import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CreateUser } from "../application/usecases/create-user.usecase";
import { CreateUserDto } from "./dtos/create-user.dto";

@Injectable()
export class UserCommands {
    @Inject(CreateUser.Usecase)
    private createUserUsecase: CreateUser.Usecase;

    @SlashCommand({
        name: "register",
        description: "Modal register user",
    })
    public async register(@Context() [interaction]: SlashCommandContext) {
        const runrunitUserInput = new TextInputBuilder()
            .setCustomId("runrunitUser")
            .setLabel("Seu usuário Runrun.it")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const modal = new ModalBuilder()
            .setCustomId("register/user")
            .setTitle("Registrar o usuário")
            .addComponents(
                new ActionRowBuilder<TextInputBuilder>().addComponents(runrunitUserInput)
            );

        return interaction.showModal(modal);
    }

    @Modal("register/user")
    protected async registerModal(@Context() [interaction]: ModalContext) {
        try {
            const discordUser = interaction.user.username;
            const runrunitUser = interaction.fields.getTextInputValue("runrunitUser");
            const dto = plainToInstance(CreateUserDto, { discordUser, runrunitUser });
            const errors = await validate(dto);

            if (errors.length > 0) {
                throw new BadRequestException("Dados inválidos no formulário.");
            }

            await this.createUserUsecase.execute(dto);

            return interaction.reply({
                content: "Usuário registrado com sucesso!",
                flags: 1 << 6,
            });
        } catch (error) {
            console.log(error);
            
            return interaction.reply({
                content: "Erro ao registrar usuário.",
                flags: 1 << 6,
            });
        }
    }
};