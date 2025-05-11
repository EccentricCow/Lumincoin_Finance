export class UrlUtils {
    public static getUrlParam(param: string): string | null {
        const url: URL = new URL(window.location.href.replace('/#', ''));
        const params: URLSearchParams = new URLSearchParams(url.search);
        return params.get(param);
    }
}