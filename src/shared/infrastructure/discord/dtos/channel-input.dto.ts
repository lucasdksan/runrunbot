import { IsNotEmpty, IsString } from "class-validator";

export class ChannelInputDto {
    @IsString()
    @IsNotEmpty()
    channelId: string; 
    
    @IsString()
    @IsNotEmpty()
    message: string
}
