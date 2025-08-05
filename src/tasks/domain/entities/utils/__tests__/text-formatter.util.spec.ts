import { textFormatterUtil } from "../text-formatter.util";

describe("textFormatterUtil", () => {
    it("deve substituir <br> por quebra de linha", () => {
        const input = "Linha1<br>Linha2<br/>Linha3<BR />";
        const output = textFormatterUtil(input);
        expect(output).toBe("Linha1\nLinha2\nLinha3");
    });

    it("deve formatar <b> para markdown com **", () => {
        const input = "Texto <b>importante</b> aqui";
        const output = textFormatterUtil(input);
        expect(output).toBe("Texto **importante** aqui");
    });

    it("deve extrair o href dos links <a>", () => {
        const input = "Clique <a href='https://example.com'>aqui</a>";
        const output = textFormatterUtil(input);
        expect(output).toBe("Clique https://example.com");
    });

    it("deve remover qualquer outra tag HTML restante", () => {
        const input = "<div>Texto <span>com</span> tags</div>";
        const output = textFormatterUtil(input);
        expect(output).toBe("Texto com tags");
    });

    it("deve remover múltiplas linhas em branco extras", () => {
        const input = "Linha 1\n   \nLinha 2\n\n   \nLinha 3";
        const output = textFormatterUtil(input);
        expect(output).toBe("Linha 1\n\nLinha 2\n\nLinha 3");
    });

    it("deve truncar texto acima de 1900 caracteres", () => {
        const longText = "a".repeat(1950);
        const output = textFormatterUtil(longText);
        expect(output.length).toBeLessThanOrEqual(1925);
        expect(output).toContain("... [mensagem truncada]");
    });

    it("deve manter texto intacto se não houver HTML", () => {
        const input = "Texto simples sem HTML";
        const output = textFormatterUtil(input);
        expect(output).toBe(input);
    });
});