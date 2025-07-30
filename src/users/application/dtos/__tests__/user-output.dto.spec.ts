import { UserEntity } from "../../../domain/entities/user.entity";
import { UserDataBuilder } from "../../../domain/helpers/user-data-builder";
import { UserOutputMapper } from "../user-output.dto";

describe("UserOutputMapper unit test", ()=>{
    it("should convert a user in output", ()=>{
        const entity = new UserEntity(UserDataBuilder({}));
        const spyToJson = jest.spyOn(entity, "toJSON");
        const sut = UserOutputMapper.toOutput(entity);

        expect(spyToJson).toHaveBeenCalled();
        expect(sut).toStrictEqual(entity.toJSON());
    });
});