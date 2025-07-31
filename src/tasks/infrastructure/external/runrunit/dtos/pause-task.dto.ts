import { IsNumber } from "class-validator";

export class PauseTaskDto {
    @IsNumber()
    id: number;
}