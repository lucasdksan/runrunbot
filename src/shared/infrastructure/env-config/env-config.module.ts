import { DynamicModule, Module } from "@nestjs/common";
import { EnvConfigService } from "./env-config.service";
import { ConfigModule, ConfigModuleOptions } from "@nestjs/config";
import { join } from "path";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: join(__dirname, "../../../../.env"),
        }),
    ],
    providers: [EnvConfigService],
    exports: [EnvConfigService],
})
export class EnvConfigModule {
    static forRoot(options?: ConfigModuleOptions): DynamicModule {
        return {
            module: EnvConfigModule,
            imports: [
                ConfigModule.forRoot({
                    isGlobal: true,
                    envFilePath: join(__dirname, "../../../.env"),
                    ...options,
                }),
            ],
            providers: [EnvConfigService],
            exports: [EnvConfigService],
        };
    }
}
