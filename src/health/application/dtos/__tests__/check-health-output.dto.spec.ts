import { CheckHealthOutputMapper } from "../check-health-output.dto";

describe("CheckHealthOutputMapper Unit Tests", () => {
    it("should return status 'ok' when both discord and database are connected", () => {
        const output = CheckHealthOutputMapper.toOutput({
            discordStatus: true,
            databaseStatus: true,
        });

        expect(output.status).toBe("ok");
        expect(output.database).toBe("connected");
        expect(output.discord).toBe("connected");
        expect(new Date(output.timestamp).toString()).not.toBe("Invalid Date");
    });

    it("should return status 'error' when discord is disconnected", () => {
        const output = CheckHealthOutputMapper.toOutput({
            discordStatus: false,
            databaseStatus: true,
        });

        expect(output.status).toBe("error");
        expect(output.database).toBe("connected");
        expect(output.discord).toBe("disconnected");
    });

    it("should return status 'error' when database is disconnected", () => {
        const output = CheckHealthOutputMapper.toOutput({
            discordStatus: true,
            databaseStatus: false,
        });

        expect(output.status).toBe("error");
        expect(output.database).toBe("disconnected");
        expect(output.discord).toBe("connected");
    });

    it("should return both as disconnected and status 'error' when both are false", () => {
        const output = CheckHealthOutputMapper.toOutput({
            discordStatus: false,
            databaseStatus: false,
        });

        expect(output.status).toBe("error");
        expect(output.database).toBe("disconnected");
        expect(output.discord).toBe("disconnected");
    });

    it("should generate a valid ISO timestamp", () => {
        const output = CheckHealthOutputMapper.toOutput({
            discordStatus: true,
            databaseStatus: true,
        });

        const date = new Date(output.timestamp);
        expect(date.toISOString()).toBe(output.timestamp);
    });
});