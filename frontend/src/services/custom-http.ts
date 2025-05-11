import {Auth} from "./auth";

export class CustomHttp {
    static async request(url: string, method: string = 'GET', body: any = null): Promise<any> {
        const params: any = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        };

        let token: string | null = localStorage.getItem(Auth.accessTokenKey);
        if (token) {
            params.headers['x-auth-token'] = token;
        }

        if (body) {
            params.body = JSON.stringify(body);
        }

        try {
            const response: Response = await fetch(url, params);

            if (response.status < 200 || response.status > 299) {
                if (response.status === 401) {
                    const result: boolean = await Auth.processUnauthorizedResponse();
                    if (result) {
                        return await this.request(url, method, body);
                    } else {
                        return null;
                    }
                }
                throw new Error(response.statusText);

                // location.href = '#/login';
                // Auth.removeTokens();
                // Auth.removeUserInfo();
            }
            return await response.json();
        } catch (e) {
            console.log(e);
        }
    }
}