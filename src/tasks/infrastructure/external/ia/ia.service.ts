import { Injectable } from "@nestjs/common";
import { GenerateContentConfig, GoogleGenAI, ToolListUnion } from "@google/genai";
import { EnvConfigService } from "../../../../shared/infrastructure/env-config/env-config.service";
import { IIARepository } from "./repositories/i-ia-repository";
import { DefaultInputDto } from "./dto/default-input.dto";
import { validateSync } from "class-validator";

@Injectable()
export class IAService implements IIARepository {
    private ai: GoogleGenAI;
    private readonly model = "gemini-2.5-pro";
    private readonly tools: ToolListUnion = [
        { googleSearch: {} }
    ];
    private readonly config: GenerateContentConfig = {
        tools: this.tools,
        systemInstruction: [
            { text: "" }
        ]
    };

    constructor(
        private readonly envConfigService: EnvConfigService,
    ) {
        this.ai = new GoogleGenAI({
            apiKey: this.envConfigService.getGeminiApiKey(),
        });
    }

    async generateResult(dto: DefaultInputDto): Promise<string> {
        try {
            const errors = validateSync(dto);
            
            if (errors.length > 0) {
                throw new Error("Dados inválidos para getTask");
            }

            const contents = [
                {
                    role: "user",
                    parts: [{ text: dto.input }],
                },
            ];
            
            const response = await this.ai.models.generateContentStream({
                model: this.model,
                contents,
                config: this.config,
            });

            let resultText = "";

            for await (const chunk of response) {
                if (chunk.text) {
                    resultText += chunk.text;
                }
            }

            return resultText.trim() || "Sem resposta da IA.";
        } catch (error) {
            console.error("Erro ao gerar conteúdo com a IA: ", error);
            throw new Error("Falha ao gerar resposta da IA.");
        }
    }
}