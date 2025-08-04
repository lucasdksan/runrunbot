import { IsNotEmpty, IsString } from "class-validator";
import { EstimateHours } from "../../application/usecases/estimate-hours.usecase";

export class EstimateDto implements EstimateHours.Input {
    @IsNotEmpty()
    @IsString()
    text: string;
}