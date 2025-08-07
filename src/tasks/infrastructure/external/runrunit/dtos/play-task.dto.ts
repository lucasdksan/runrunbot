import { IsNotEmpty, IsNumber } from "class-validator";

export class PlayTaskDto {
    @IsNumber()
    @IsNotEmpty()
    id: number;
}