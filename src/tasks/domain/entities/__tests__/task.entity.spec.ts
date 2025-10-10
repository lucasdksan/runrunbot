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

    it("separationResponsibleId: deve retonar as tarefas separadas por responsible_id", () => {
        const tasks = [
            { id: 1, title: "Task A", responsible_id: "user-1" },
            { id: 2, title: "Task B", responsible_id: "user-2" },
            { id: 3, title: "Task C", responsible_id: "user-1" },
            { id: 4, title: "Task D", responsible_id: "user-3" },
            { id: 5, title: "Task E", responsible_id: "user-2" },
        ];

        const result = TaskEntity.separationResponsibleId(tasks);

        expect(result).toHaveProperty("user-1");
        expect(result).toHaveProperty("user-2");
        expect(result).toHaveProperty("user-3");

        // user-1 deve ter 2 tarefas
        expect(result["user-1"]).toHaveLength(2);
        expect(result["user-1"].map(t => t.id)).toEqual(expect.arrayContaining([1, 3]));

        // user-2 deve ter 2 tarefas
        expect(result["user-2"]).toHaveLength(2);
        expect(result["user-2"].map(t => t.id)).toEqual(expect.arrayContaining([2, 5]));

        // user-3 deve ter apenas 1 tarefa
        expect(result["user-3"]).toHaveLength(1);
        expect(result["user-3"][0].id).toBe(4);

    });


    it("deve retornar apenas os campos esperados de cada tarefa", () => {
        const tasks = [
            {
                id: 1,
                title: "Task A",
                current_estimate_seconds: 3600,
                time_worked: 1800,
                estimated_start_date: "2025-10-10",
                estimated_delivery_date: "2025-10-15",
                start_date: "2025-10-11",
                close_date: "2025-10-12",
                is_closed: false,
                priority: "Alta",
                // campos extras que devem ser ignorados
                description: "Should not appear",
                assignee: "user-1",
            },
            {
                id: 2,
                title: "Task B",
                current_estimate_seconds: 7200,
                time_worked: 3000,
                estimated_start_date: "2025-10-01",
                estimated_delivery_date: "2025-10-05",
                start_date: "2025-10-02",
                close_date: "2025-10-06",
                is_closed: true,
                priority: "Média",
            },
        ];

        const result = TaskEntity.prepareTasksForAnalysis(tasks);

        expect(result).toHaveLength(2);

        // Verifica que apenas os campos esperados estão presentes
        expect(result[0]).toEqual({
            id: 1,
            title: "Task A",
            current_estimate_seconds: 3600,
            time_worked: 1800,
            estimated_start_date: "2025-10-10",
            estimated_delivery_date: "2025-10-15",
            start_date: "2025-10-11",
            close_date: "2025-10-12",
            is_closed: false,
            priority: "Alta",
        });

        // Garante que propriedades extras foram removidas
        expect(result[0]).not.toHaveProperty("description");
        expect(result[0]).not.toHaveProperty("assignee");

        // Verifica o segundo item
        expect(result[1]).toEqual({
            id: 2,
            title: "Task B",
            current_estimate_seconds: 7200,
            time_worked: 3000,
            estimated_start_date: "2025-10-01",
            estimated_delivery_date: "2025-10-05",
            start_date: "2025-10-02",
            close_date: "2025-10-06",
            is_closed: true,
            priority: "Média",
        });
    });

    it("deve retornar um array vazio quando não houver tarefas", () => {
        const result = TaskEntity.prepareTasksForAnalysis([]);
        expect(result).toEqual([]);
    });
});