import { Module } from "@nestjs/common";
import { RunrunitService } from "./runrunit.service";
import { EnvConfigService } from "../../../../shared/infrastructure/env-config/env-config.service";

@Module({
    imports: [EnvConfigService],
    providers: [RunrunitService],
    exports: [RunrunitService]
})
export class RunrunitModule {};