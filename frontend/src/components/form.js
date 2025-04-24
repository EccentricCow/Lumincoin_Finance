import {Auth} from "../services/auth";
import {CustomHttp} from "../services/custom-http";
import {config} from "../config/config";

export class Form {
    constructor(page) {
        this.formActionElement = document.getElementById('form-action');
        const accessToken = localStorage.getItem(Auth.accessTokenKey);
        if (accessToken) {
            location.href = '#/';
            return;
        }

        this.formFields = [
            {
                name: 'email',
                id: 'email',
                element: null,
                regexp: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                isValid: false,
            },
            {
                name: 'password',
                id: 'password',
                element: null,
                regexp: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                isValid: false,
            },
        ];
        if (page === 'signup') {
            this.formFields.push(
                {
                    name: 'fullName',
                    id: 'fullName',
                    regexp: /^[А-ЯЁ][а-яё]*(?:\s[А-ЯЁ][а-яё]*)*$/,
                    element: null,
                    isValid: false,
                },
                {
                    name: 'passwordRepeat',
                    id: 'passwordRepeat',
                    regexp: null,
                    element: null,
                    isValid: false,
                },
            );
        }
        this.formFields.forEach(field => {
            field.element = document.getElementById(field.id);
        });

        this.formActionElement.addEventListener('click', (e) => {
            e.preventDefault();
            if (this.validateForm(page, this.formFields)) {
                this.processForm(page).then();
            }
        });
    };

    async processForm(page) {
        const email = this.formFields.find(item => item.name === 'email').element.value;
        const password = this.formFields.find(item => item.name === 'password').element.value;

        if (page === 'signup') {
            const fullName = this.formFields.find(item => item.name === 'fullName').element.value;
            try {
                const result = await CustomHttp.request(config.host + '/signup', 'POST', {
                    name: fullName.split(' ')[0],
                    lastName: fullName.split(' ')[1],
                    email: email,
                    password: password,
                    passwordRepeat: document.getElementById('passwordRepeat').value,
                });
                if (result) {
                    if (result.error || !result.user) {
                        throw new Error(result.message);
                    }
                }
            } catch (error) {
                return console.log(error);
            }
        }

        try {
            const result = await CustomHttp.request(config.host + '/login', 'POST', {
                email: email,
                password: password,
                rememberMe: page === 'login' ? document.getElementById('rememberMe').checked : false,
            });
            if (result) {
                if (result.error || !result.tokens || !result.tokens.accessToken || !result.tokens.refreshToken || !result.user) {
                    alert(result.message);
                    throw new Error(result.message);
                }
                Auth.setTokens(result.tokens.accessToken, result.tokens.refreshToken);
                Auth.setUserInfo(result.user);
                location.href = '#/';
            }
        } catch (error) {
            return console.log(error);
        }
    }

    validateForm(page, fields) {
        let isValid = true;
        fields.forEach(field => {
            if (!field.element.value || (field.regexp && !field.element.value.match(field.regexp))) {
                field.element.classList.add('is-invalid');
                isValid = false;
            } else {
                field.element.classList.remove('is-invalid');
            }
        });
        if (page === 'signup') {
            const passwordRepeatField = fields.find(field => field.name === 'passwordRepeat');
            const passwordField = fields.find(field => field.name === 'password');
            if (!passwordRepeatField.element.value || passwordRepeatField.element.value !== passwordField.element.value) {
                passwordRepeatField.element.classList.add('is-invalid');
                isValid = false;
            } else {
                passwordRepeatField.element.classList.remove('is-invalid');
            }
        }
        return isValid;
    }
}