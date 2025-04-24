import {config} from "../config/config";

export class Auth {
    static accessTokenKey = 'accessToken';
    static refreshTokenKey = 'refreshToken';
    static userInfoKey = 'userInfo';

    static async processUnauthorizedResponse() {
        const refreshToken = localStorage.getItem(this.refreshTokenKey);
        if (refreshToken) {
            const response = await fetch(config.host + '/refresh', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({refreshToken: refreshToken})
            });

            if (response && response.status === 200) {
                const result = await response.json();
                if (result && !result.error && result.tokens && result.tokens.accessToken && result.tokens.refreshToken) {
                    this.setTokens(result.tokens.accessToken, result.tokens.refreshToken);
                    return true;
                }
            }

            this.removeTokens();
            this.removeUserInfo();
            location.href = '#/login';
            return false;
        }
    };

    static async logout() {
        const refreshToken = localStorage.getItem(this.refreshTokenKey);
        if (refreshToken) {
            const response = await fetch(config.host + '/logout', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({refreshToken: refreshToken,}),
            });

            if (response && response.status === 200) {
                const result = await response.json();
                if (result && !result.error) {
                    this.removeTokens();
                    this.removeUserInfo();
                }
            }
        }
    };

    static setTokens(accessToken, refreshToken) {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
    };

    static removeTokens() {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
    };

    static setUserInfo(userInfo) {
        localStorage.setItem(this.userInfoKey, JSON.stringify(userInfo));
    };

    static getUserInfo() {
        return JSON.parse(localStorage.getItem(this.userInfoKey));
    };

    static removeUserInfo() {
        localStorage.removeItem(this.userInfoKey);
    }
}