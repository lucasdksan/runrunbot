import { IsNotEmpty, IsString } from "class-validator";

export class DefaultInputDto {
    @IsString()
    @IsNotEmpty()
    input: string;
}
