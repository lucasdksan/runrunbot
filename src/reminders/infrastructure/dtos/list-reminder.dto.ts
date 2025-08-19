import { IsBoolean, IsDate, IsIn, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ListReminder } from "../../application/usecases/list-reminder.usecase";

export class ListReminderDto implements ListReminder.Input {
    @IsString()
    @IsNotEmpty()
    discordUser: string;
}