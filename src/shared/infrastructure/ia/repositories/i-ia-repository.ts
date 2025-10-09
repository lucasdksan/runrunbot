import { DefaultInputDto } from "../dtos/default-input.dto";

export interface IIARepository {
    generateResult(dto: DefaultInputDto): Promise<string>;
}