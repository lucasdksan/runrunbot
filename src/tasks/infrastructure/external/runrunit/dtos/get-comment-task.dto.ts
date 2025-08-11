import { IsNotEmpty, IsNumber } from "class-validator";

export class GetCommentTaskDto {
    @IsNumber()
    @IsNotEmpty()
    id: number;
}
