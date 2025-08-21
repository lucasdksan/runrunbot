import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import * as sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

@Injectable()
export class SqliteService implements OnModuleInit, OnModuleDestroy {
    private db: Database<sqlite3.Database, sqlite3.Statement>;

    async onModuleInit() {
        this.db = await open({
            filename: process.env.SQLITE_PATH || "database.sqlite",
            driver: sqlite3.Database,
        });

        await this.db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                discordUser TEXT NOT NULL,
                discordId TEXT NOT NULL,
                runrunitUser TEXT NOT NULL,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await this.db.exec(`
            CREATE TABLE IF NOT EXISTS reminders (
                id TEXT PRIMARY KEY,
                userId TEXT NOT NULL,
                channelId TEXT,
                message TEXT NOT NULL,
                remindAt DATETIME NOT NULL,
                sendTo TEXT NOT NULL CHECK(sendTo IN ('DM', 'CHANNEL')),
                reminded BOOLEAN DEFAULT 0,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `);        
    }

    async onModuleDestroy() {
        await this.db.close();
    }

    get connection() {
        return this.db;
    }
}