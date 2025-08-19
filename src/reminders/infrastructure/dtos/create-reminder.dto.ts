import { IsBoolean, IsDate, IsIn, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { CreateReminder } from "../../application/usecases/create-reminder.usecase";

export class CreateReminderDto implements CreateReminder.Input {
    @IsString()
    @IsNotEmpty()
    discordUser: string;

    @IsString()
    @IsOptional()
    channelId?: string;

    @IsString()
    @IsNotEmpty()
    message: string;

    @IsDate()
    @IsNotEmpty()
    remindAt: Date;

    @IsIn(["DM", "CHANNEL"])
    @IsNotEmpty()
    sendTo: "DM" | "CHANNEL";

    @IsBoolean()
    @IsOptional()
    reminded?: boolean;
}