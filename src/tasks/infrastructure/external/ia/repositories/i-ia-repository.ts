import { DefaultInputDto } from "../dto/default-input.dto";

export interface IIARepository {
    generateResult(dto: DefaultInputDto): Promise<string>;
}