import { IsNotEmpty, IsNumber } from "class-validator";

export class GetDescriptionTaskDto {
    @IsNumber()
    @IsNotEmpty()
    id: number;
}
