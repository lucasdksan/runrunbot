export type DefaultOutput = { 
    message: string;
};

export class DefaultOutputMapper {
    static toOutput(input: string): DefaultOutput {
        return {
            message: input
        };
    }
}