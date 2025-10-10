import { UserDataBuilder } from "../../helpers/user-data-builder";
import { UserEntity, UserProps } from "../user.entity";

describe("UserEntity unit tests", () => {
    let props: UserProps;
    let sut: UserEntity;

    beforeEach(() => {
        UserEntity.validate = jest.fn();
        props = UserDataBuilder({});

        sut = new UserEntity(props);
    });

    it("Contructor Method", () => {
        expect(UserEntity.validate).toHaveBeenCalled();
        expect(sut.props.discordUser).toEqual(props.discordUser);
        expect(sut.props.runrunitUser).toEqual(props.runrunitUser);
        expect(sut.props.createdAt).toBeInstanceOf(Date);
    });

    it("Getter of discordUser field", () => {
        expect(sut.discordUser).toBeDefined();
        expect(sut.discordUser).toEqual(props.discordUser);
        expect(typeof sut.props.discordUser).toBe("string");
    });

    it("Setter of discordUser field", () => {
        sut["discordUser"] = "Other name";
        expect(sut.discordUser).toEqual("Other name");
        expect(typeof sut.props.discordUser).toBe("string");
    });

    it("Setter of discordId field", () => {
        sut["discordId"] = "123456789";
        expect(sut.discordId).toEqual("123456789");
        expect(typeof sut.props.discordId).toBe("string");
    });

    it("Setter of runrunitUser field", () => {
        sut["runrunitUser"] = "Other name";
        expect(sut.runrunitUser).toEqual("Other name");
        expect(typeof sut.props.runrunitUser).toBe("string");
    });

    it("Should update a user", () => {
        expect(UserEntity.validate).toHaveBeenCalled();
        sut.update({ discordUser: "Other name" });
        expect(sut.discordUser).toEqual("Other name");
    });

    it("Should update a user #2", () => {
        expect(UserEntity.validate).toHaveBeenCalled();
        sut.update({ runrunitUser: "Other name" });
        expect(sut.runrunitUser).toEqual("Other name");
    });

    it("Getter of createdAt field", () => {
        expect(sut.createdAt).toBeDefined();
        expect(sut.createdAt).toBeInstanceOf(Date);
    });

    it("deve retornar apenas as tarefas atribuídas ao runrunId informado", () => {
        const runrunId = "user-123";
        const tasks = [
            { id: 1, title: "Task A", responsible_id: "user-123" },
            { id: 2, title: "Task B", responsible_id: "user-456" },
            { id: 3, title: "Task C", responsible_id: "user-123" },
            { id: 4, title: "Task D", responsible_id: "user-789" },
        ];

        const result = UserEntity.filterTask(tasks, runrunId);

        expect(result).toHaveLength(2);
        const ids = result.map((t) => t.id);
        expect(ids).toEqual(expect.arrayContaining([1, 3]));
    });

    it("deve retornar um array vazio se nenhuma tarefa corresponder ao runrunId", () => {
        const runrunId = "user-999";
        const tasks = [
            { id: 1, responsible_id: "user-123" },
            { id: 2, responsible_id: "user-456" },
        ];

        const result = UserEntity.filterTask(tasks, runrunId);

        expect(result).toEqual([]);
    });

    it("deve lidar com lista vazia de tarefas", () => {
        const result = UserEntity.filterTask([], "user-123");
        expect(result).toEqual([]);
    });

    it("deve retonar a role do usuário como 'dev' quando runrunitUser contém 'dev'", () => {
        const user = new UserEntity(UserDataBuilder({ runrunitUser: "dev-john" }));
        expect(user.getRole()).toBe("dev");
    });

    it("deve retonar a role do usuário como 'gestor' quando runrunitUser não contém 'dev'", () => {
        const user = new UserEntity(UserDataBuilder({ runrunitUser: "jane-gestor" }));
        expect(user.getRole()).toBe("gestor");
    });
});