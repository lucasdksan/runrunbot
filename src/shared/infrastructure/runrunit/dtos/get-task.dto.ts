import { IsNotEmpty, IsNumber } from "class-validator";

export class GetTaskDto {
    @IsNumber()
    @IsNotEmpty()
    id: number;
}