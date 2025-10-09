import { MessageInputDto } from "../dtos/message-input.dto";

export class DiscordMessageIAModel {
    static build(discordId: string, discordUser: string, generateResponses: string[]): MessageInputDto[]{
        const listMSG: MessageInputDto[] = [];

        generateResponses.forEach((msg, index) => {
            let dto = new MessageInputDto();

            dto.userId = discordId;
            
            if(index === 0) {
                dto.message = `
                    Olá ${discordUser}! 👋

                    Aqui está seu resumo semanal de performance.  
                    Use esse feedback para continuar evoluindo nas suas entregas! 🚀

                    📊 **Resumo:**
                    ${msg}
                `;
            } else {
                dto.message = msg;
            }

            listMSG.push(dto);
        });

        return listMSG;
    }
}