import { Module } from "@nestjs/common";
import { RunrunitService } from "./runrunit.service";
import { EnvConfigModule } from "../../../../shared/infrastructure/env-config/env-config.module";

@Module({
    imports: [EnvConfigModule],
    providers: [RunrunitService],
    exports: [RunrunitService]
})
export class RunrunitModule {};