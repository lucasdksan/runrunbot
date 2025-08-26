import { IsNotEmpty, IsString } from "class-validator";

export class MessageInputDto {
    @IsString()
    @IsNotEmpty()
    userId: string; 
    
    @IsString()
    @IsNotEmpty()
    message: string
}
