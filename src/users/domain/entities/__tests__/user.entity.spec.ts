import { UserDataBuilder } from "../../helpers/user-data-builder";
import { UserEntity, UserProps } from "../user.entity";

describe("UserEntity unit tests", ()=>{
    let props: UserProps;
    let sut: UserEntity;

    beforeEach(()=>{
        UserEntity.validate = jest.fn();
        props = UserDataBuilder({});

        sut = new UserEntity(props);
    });

    it("Contructor Method", ()=>{
        expect(UserEntity.validate).toHaveBeenCalled();
        expect(sut.props.discordUser).toEqual(props.discordUser);
        expect(sut.props.runrunitUser).toEqual(props.runrunitUser);
        expect(sut.props.createdAt).toBeInstanceOf(Date);
    });

    it("Getter of discordUser field", ()=>{
        expect(sut.discordUser).toBeDefined();
        expect(sut.discordUser).toEqual(props.discordUser);
        expect(typeof sut.props.discordUser).toBe("string");
    });

    it("Setter of discordUser field", ()=>{
        sut["discordUser"] = "Other name";
        expect(sut.discordUser).toEqual("Other name");
        expect(typeof sut.props.discordUser).toBe("string");
    });

    it("Setter of runrunitUser field", ()=>{
        sut["runrunitUser"] = "Other name";
        expect(sut.runrunitUser).toEqual("Other name");
        expect(typeof sut.props.runrunitUser).toBe("string");
    });

    it("Should update a user", ()=>{
        expect(UserEntity.validate).toHaveBeenCalled();
        sut.update({ discordUser: "Other name"});
        expect(sut.discordUser).toEqual("Other name");
    });

    it("Should update a user #2", ()=>{
        expect(UserEntity.validate).toHaveBeenCalled();
        sut.update({ runrunitUser: "Other name"});
        expect(sut.runrunitUser).toEqual("Other name");
    });

    it("Getter of createdAt field", ()=>{
        expect(sut.createdAt).toBeDefined();
        expect(sut.createdAt).toBeInstanceOf(Date);
    });
});