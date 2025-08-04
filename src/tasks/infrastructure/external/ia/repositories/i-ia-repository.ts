export interface IIARepository {
    generateResult(input: string): Promise<string>;
}