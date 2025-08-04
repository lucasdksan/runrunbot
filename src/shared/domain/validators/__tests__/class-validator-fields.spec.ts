import { ClassValidatorFields } from "../class-validator-fields";
import * as libClassValidator from "class-validator";

class StubClassValidatorFields extends ClassValidatorFields<{ field: string }> { }

describe("ClassValidatorFields unit test", () => {
    let sut: StubClassValidatorFields
    let spyValidateSync: jest.SpyInstance<libClassValidator.ValidationError[], [schemaName: string, object: object, validatorOptions?: libClassValidator.ValidatorOptions], any>

    beforeEach(() => {
        sut = new StubClassValidatorFields();
        spyValidateSync = jest.spyOn(libClassValidator, "validateSync");
    });

    it("Should initialize errors and validated Data variables with null.", () => {
        expect(sut.errors).toBeNull();
        expect(sut.validatedData).toBeNull();
    });

    it("Should validate with errors.", async () => {
        spyValidateSync.mockReturnValue([{
            property: "field", constraints: { isRequired: "test error" }
        }]);

        expect(sut.validate(null)).toBeFalsy();
        expect(spyValidateSync).toHaveBeenCalled();
        expect(sut.validatedData).toBeNull();
        expect(sut.errors).toStrictEqual({ field: ["test error"] });
    });

    it("Should validate without errors.", async () => {
        spyValidateSync.mockReturnValue([]);

        expect(sut.validate({ field: "value" })).toBeTruthy();
        expect(spyValidateSync).toHaveBeenCalled();
        expect(sut.validatedData).toStrictEqual({ field: "value" });
        expect(sut.errors).toBeNull();
    });
});