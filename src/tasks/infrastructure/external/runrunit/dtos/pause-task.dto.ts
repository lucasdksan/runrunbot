import { IsNotEmpty, IsNumber } from "class-validator";

export class PauseTaskDto {
    @IsNumber()
    @IsNotEmpty()
    id: number;
}