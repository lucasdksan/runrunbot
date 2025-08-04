import { validate as uuidValidate } from "uuid";
import { Entity } from "../entity";

type StubProps = {
    prop1: string;
    prop2: number;
}

class StubEntity extends Entity<StubProps> {

}

describe("Entity unit test", () => {
    let props: StubProps;
    let entity: StubEntity;
    let id: string;

    beforeEach(() => {
        props = { prop1: "value1", prop2: 10 };
        entity = new StubEntity(props);
        id = "e29202d4-91fd-42fc-a429-29a975bcd61f";
    });

    it("Should set props and id", () => {
        expect(entity.props).toStrictEqual(props);
        expect(entity.id).not.toBeNull();
        expect(uuidValidate(entity._id)).toBeTruthy();
    });

    it("Should accept a valid uuid", () => {
        const entity2 = new StubEntity(props, id);

        expect(uuidValidate(entity2._id)).toBeTruthy();
        expect(entity2.id).toEqual(id);
    });

    it("Should convert a entity to a JavaScript Object", () => {
        const entity2 = new StubEntity(props, id);

        expect(entity2.toJSON()).toStrictEqual({
            id,
            ...props
        })
    });
});