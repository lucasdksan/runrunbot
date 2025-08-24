import { IsBoolean, IsDate, IsIn, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { CreateReminder } from "../../application/usecases/create-reminder.usecase";

export class CreateReminderDto implements CreateReminder.Input {
    @IsString()
    @IsNotEmpty()
    discordUser: string;

    @IsString()
    @IsNotEmpty()
    message: string;

    @IsDate()
    @IsNotEmpty()
    remindAt: Date;

    @IsBoolean()
    @IsOptional()
    reminded?: boolean;
}