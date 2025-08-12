import {config} from "../config/config";
import {UserInfoType} from "../types/user-info.type";
import {RefreshResponseType} from "../types/auth/refresh-response.type";
import {LogoutResponseType} from "../types/auth/logout-response.type";

export class Auth {
    public static accessTokenKey: string = 'accessToken';
    public static refreshTokenKey: string = 'refreshToken';
    private static userInfoKey: string = 'userInfo';

    public static async processUnauthorizedResponse(): Promise<boolean> {
        const refreshToken: string | null = localStorage.getItem(this.refreshTokenKey);
        if (refreshToken) {
            const response: Response = await fetch(config.host + '/refresh', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({refreshToken: refreshToken})
            });

            if (response && response.status === 200) {
                const result: RefreshResponseType | null = await response.json();
                if (result) {
                    this.setTokens(result.tokens.accessToken, result.tokens.refreshToken);
                    return true;
                }
            }

            this.removeTokens();
            this.removeUserInfo();
            location.href = '#/login';
        }
        return false;
    };

    public static async logout(): Promise<void> {
        const refreshToken: string | null = localStorage.getItem(this.refreshTokenKey);
        if (refreshToken) {
            const response: Response = await fetch(config.host + '/logout', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({refreshToken: refreshToken,}),
            });

            if (response && response.status === 200) {
                const result: LogoutResponseType = await response.json();
                if (result && !result.error) {
                    this.removeTokens();
                    this.removeUserInfo();
                }
            }
        }
    };

    public static setTokens(accessToken: string, refreshToken: string): void {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
    };

    private static removeTokens(): void {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
    };

    public static setUserInfo(userInfo: UserInfoType) {
        localStorage.setItem(this.userInfoKey, JSON.stringify(userInfo));
    };

    public static getUserInfo(): UserInfoType | null {
        const userInfo: string | null = localStorage.getItem(this.userInfoKey);
        if (userInfo) {
            return JSON.parse(userInfo);
        }
        return null;
    };

    static removeUserInfo() {
        localStorage.removeItem(this.userInfoKey);
    }
}