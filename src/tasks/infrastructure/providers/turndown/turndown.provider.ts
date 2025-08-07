import TurndownService from "turndown";
import { ConvertProvider } from "../../../../shared/application/providers/convert.provider";

export class TurndownProvider implements ConvertProvider {
    private turndownService: TurndownService;

    constructor() {
        this.turndownService = new TurndownService({
            headingStyle: "atx",
            codeBlockStyle: "fenced",
            bulletListMarker: "-",
        })

        this.turndownService.addRule("removeScripts", {
            filter: ["script"],
            replacement: () => ""
        })

        this.turndownService.addRule("boldSpan", {
            filter: (node) => {
                return (
                    node.nodeName === "SPAN" &&
                    (node as HTMLElement).style.fontWeight === "bold"
                )
            },
            replacement: (content) => `**${content}**`,
        })
    }

    convertHTMLtoMD(input: string): string {
        return this.turndownService.turndown(input);
    }
}