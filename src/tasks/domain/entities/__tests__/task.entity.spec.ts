import "reflect-metadata";
import { TaskDataBuilder } from "../../helpers/task-data-builder";
import { TaskEntity, TaskProps } from "../task.entity";

describe("TaskEntity unit tests", () => {
    let props: TaskProps;
    let sut: TaskEntity;
    let runrunitUser = "user-123";
    let baseTask = {
        board_stage_name: "Ongoing",
        is_working_on: true,
        assignments: [{ assignee_id: runrunitUser }],
    };

    beforeEach(() => {
        TaskEntity.validate = jest.fn();
        props = TaskDataBuilder({});

        sut = new TaskEntity(props);
    });

    it("Contructor Method", () => {
        expect(TaskEntity.validate).toHaveBeenCalled();
        expect(sut.props.task_tags).toEqual(props.task_tags);
        expect(sut.props.title).toEqual(props.title);
    });

    it("Getter of task_tags field", () => {
        expect(sut.task_tags).toBeDefined();
    });

    it("Setter of title field", () => {
        sut["title"] = "Other name";
        expect(sut.title).toEqual("Other name");
        expect(typeof sut.props.title).toBe("string");
    });

    it("taskOngoing: deve retornar apenas tarefas em 'Ongoing' atribuídas ao usuário e com is_working_on = true", () => {
        const tasks = [
            { ...baseTask, id: 1 },
            { ...baseTask, board_stage_name: "Task", id: 2 },
            { ...baseTask, is_working_on: false, id: 3 },
            { ...baseTask, assignments: [{ assignee_id: "outro-user" }], id: 4 },
        ];

        const result = TaskEntity.taskOngoing(runrunitUser, tasks);

        expect(result).toHaveLength(1);
        expect(result[0].id).toBe(1);
    });

    it("filterTasks: deve retornar tarefas nos estágios permitidos atribuídas ao usuário", () => {
        const tasks = [
            { ...baseTask, board_stage_name: "Ongoing", id: 1 },
            { ...baseTask, board_stage_name: "Task", id: 2 },
            { ...baseTask, board_stage_name: "Ready for Production", id: 3 },
            { ...baseTask, board_stage_name: "Finalizado", id: 4 },
            { ...baseTask, board_stage_name: "Ongoing", assignments: [{ assignee_id: "outro-user" }], id: 5 },
        ];

        const result = TaskEntity.filterTasks(runrunitUser, tasks);

        expect(result).toHaveLength(3);
        const ids = result.map((t) => t.id);
        expect(ids).toEqual(expect.arrayContaining([1, 2, 3]));
    });
});