import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateCommentDto {
    @IsNumber()
    @IsNotEmpty()
    taskId: number;

    @IsString()
    @IsNotEmpty()
    comment: string;
}
