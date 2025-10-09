import { Inject, Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { AnalyzePerformance } from "../application/usecases/analyze-performance.usecase";

@Injectable()
export class UserSchedules {
    @Inject(AnalyzePerformance.Usecase)
    private analyzePerformance: AnalyzePerformance.Usecase;
    
    @Cron("48 23 * * *")
    async handleMessage() {
        await this.analyzePerformance.execute();
    }
}