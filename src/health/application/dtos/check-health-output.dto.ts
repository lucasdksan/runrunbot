export type CheckHealthOutput = {
    status: string;
    database: string;
    discord: string;
    timestamp: string;
};

export class CheckHealthOutputMapper {
    static toOutput({ databaseStatus, discordStatus }:{
        discordStatus: boolean;
        databaseStatus: boolean;
    }):CheckHealthOutput {
        return {
            status: discordStatus && databaseStatus ? "ok" : "error",
            database: databaseStatus ? "connected" : "disconnected",
            discord: discordStatus ? "connected" : "disconnected",
            timestamp: new Date().toISOString(),
        }
    }
}