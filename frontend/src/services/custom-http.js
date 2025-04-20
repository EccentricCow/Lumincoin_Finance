import {Auth} from "./auth";

export class CustomHttp {
    static async request(url, method = 'GET', body = null) {
        const params = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        };

        let token = localStorage.getItem(Auth.accessTokenKey);
        if (token) {
            params.headers['x-access-token'] = token;
        }

        if (body) {
            params.body = JSON.stringify(body);
        }

        try {
            const response = await fetch(url, params);

            if (response.status < 200 || response.status > 299) {
                if (response.status === 401) {
                    const result = await Auth.processUnauthorizedResponse();
                    return (result ? await this.request(url, method, body) : await response.json());
                }

                // throw new Error(response.json().message);
                // как здесь обработать ошибку?
            }
            return await response.json();
        } catch (e) {
            console.log(e);
        }
    }
}