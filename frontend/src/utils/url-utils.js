export class UrlUtils {
    static getUrlParam(param) {
        const url = new URL(window.location.href.replace('/#', ''));
        const params = new URLSearchParams(url.search);
        return params.get(param);
    }
}