export function textFormatterUtil(value: string) {
    let text = value.replace(/<br\s*\/?>/gi, "\n");

    text = text.replace(/<b>(.*?)<\/b>/gi, "**$1**");
    text = text.replace(/<a[^>]+href="([^"]+)"[^>]*>(.*?)<\/a>/gi, "$1");
    text = text.replace(/<\/?[^>]+(>|$)/g, "");
    text = text.replace(/\n\s+\n/g, "\n\n").trim();

    if (text.length > 1900) {
        text = text.slice(0, 1900) + "\n... [mensagem truncada]";
    }

    return text;
}