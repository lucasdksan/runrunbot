import { Injectable } from "@nestjs/common";

@Injectable()
export class DiscordService {
    constructor() { }

    public display() {
        return "Discord Service is running!";
    }

    public async getTasks() {
        const response = await fetch(`https://secure.runrun.it/api/v1.0/tasks?board_stage_name=Ready for Production`, {
            headers: {
                "App-Key": "204c372005e3c2e5ea0fbac5c6afb261",
                "User-Token": "gyhu35KrfbVnhryvAMXr",
                "Content-Type": "application/json"
            },
        });

        if (!response.ok) {

        }

        const taskData = await response.json();

        const taskFilted = taskData.filter(t => t.board_stage_name === "Ready for Production")

        return taskFilted.map((t) => ({ id: t.id, title: t.title }));
    }

    public async getTasksOn() {
        const response = await fetch(`https://secure.runrun.it/api/v1.0/tasks`, {
            headers: {
                "App-Key": "204c372005e3c2e5ea0fbac5c6afb261",
                "User-Token": "gyhu35KrfbVnhryvAMXr",
                "Content-Type": "application/json"
            },
        });

        if (!response.ok) {
            return [];
        }

        const taskData = await response.json();

        const taskFilted = taskData.filter(t => t.is_working_on)

        return taskFilted.map((t) => ({ id: t.id, title: t.title }));
    }

    public async pauseTasks(taskIds: number[]): Promise<void> {
        if (!Array.isArray(taskIds) || taskIds.length === 0) {
            throw new Error('Nenhuma task para pausar.');
        }

        // Cria um array de Promises para pausar cada task
        const pausePromises = taskIds.map(async (taskId) => {
            const res = await fetch(`https://secure.runrun.it/api/v1.0/tasks/${taskId}/pause`, {
                headers: {
                    "App-Key": "204c372005e3c2e5ea0fbac5c6afb261",
                    "User-Token": "gyhu35KrfbVnhryvAMXr",
                    "Content-Type": "application/json"
                },
                method: "POST"
            });

            if (!res.ok) {
                console.error(`Falha ao pausar a task ${taskId}: ${res.status} ${res.statusText}`);
                return { taskId, success: false };
            }

            return { taskId, success: true };
        });

        const results = await Promise.all(pausePromises);
        const failed = results.filter(r => !r.success);
        
        if (failed.length > 0) {
            throw new Error(`Não foi possível pausar as seguintes tasks: ${failed.map(f => f.taskId).join(', ')}`);
        }
    }
};