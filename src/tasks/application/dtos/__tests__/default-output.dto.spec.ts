import { DefaultOutputMapper } from "../default-output.dto";

describe("DefaultOutputMapper unit test", ()=>{
    it("should convert a default in output", ()=>{
        const message = "Single test";

        const sut = DefaultOutputMapper.toOutput(message);

        expect(sut).toMatchObject({
            message
        });
        expect(sut.message).toEqual(message);
    });
});