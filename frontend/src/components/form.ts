import {Auth} from "../services/auth";
import {CustomHttp} from "../services/custom-http";
import {config} from "../config/config";
import {AuthPageType} from "../types/auth/auth-page.type";
import {FormFieldType} from "../types/form-field.type";
import {SignupResponseType} from "../types/auth/signup-response.type";
import {DefaultResponseType} from "../types/default-response.type";
import {LoginResponseType} from "../types/auth/login-response.type";

export class Form {
    private formActionElement: HTMLElement | null;
    readonly formFields: FormFieldType[] = [];

    constructor(page: AuthPageType) {
        this.formActionElement = document.getElementById('form-action');
        const accessToken: string | null = localStorage.getItem(Auth.accessTokenKey);
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
        if (page === AuthPageType.signup) {
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
        this.formFields.forEach((field: FormFieldType): void => {
            field.element = document.getElementById(field.id) as HTMLInputElement;
        });

        this.formActionElement?.addEventListener('click', (e: Event): void => {
            e.preventDefault();
            if (this.validateForm(page, this.formFields)) {
                this.processForm(page).then();
            }
        });
    };

    private async processForm(page: AuthPageType): Promise<void> {
        const email: string | null | undefined =
            (this.formFields.find((item: FormFieldType): boolean => item.name === 'email')?.element as HTMLInputElement)?.value;
        const password: string | null | undefined =
            (this.formFields.find((item: FormFieldType): boolean => item.name === 'password')?.element as HTMLInputElement)?.value;

        if (page === AuthPageType.signup) {
            const fullName: string | null | undefined =
                (this.formFields.find((item: FormFieldType): boolean => item.name === 'fullName')?.element as HTMLInputElement)?.value;
            try {
                const result: SignupResponseType | DefaultResponseType = await CustomHttp.request(config.host + '/signup', 'POST', {
                    name: fullName?.split(' ')[0],
                    lastName: fullName?.split(' ')[1],
                    email: email,
                    password: password,
                    passwordRepeat: (document.getElementById('passwordRepeat') as HTMLInputElement)?.value,
                });

                if ((result as DefaultResponseType).error !== undefined) {
                    throw new Error((result as DefaultResponseType).message);
                }
            } catch (error) {
                return console.log(error);
            }
        }

        try {
            const result: LoginResponseType | DefaultResponseType = await CustomHttp.request(config.host + '/login', 'POST', {
                email: email,
                password: password,
                rememberMe: page === 'login' ? (document.getElementById('rememberMe') as HTMLInputElement)?.checked : false,
            });

            if ((result as DefaultResponseType).error !== undefined) {
                throw new Error((result as DefaultResponseType).message);
            }

            if (!(result as LoginResponseType).tokens && !(result as LoginResponseType).tokens.accessToken
                && !(result as LoginResponseType).tokens.refreshToken && !(result as LoginResponseType).user) {
                throw new Error('No some data');
            }

            Auth.setTokens((result as LoginResponseType).tokens.accessToken,
                (result as LoginResponseType).tokens.refreshToken);
            Auth.setUserInfo((result as LoginResponseType).user);
            location.href = '#/';

        } catch (error) {
            return console.log(error);
        }
    };


    private validateForm(page: AuthPageType, fields: FormFieldType[]): boolean {
        let isValid: boolean = true;
        fields.forEach((field: FormFieldType): void => {
            if (!field.element?.value || (field.regexp && !field.element.value.match(field.regexp))) {
                field.element?.classList.add('is-invalid');
                isValid = false;
            } else {
                field.element.classList.remove('is-invalid');
            }
        });
        if (page === AuthPageType.signup) {
            const passwordRepeatField: FormFieldType | undefined = fields.find((field: FormFieldType): boolean => field.name === 'passwordRepeat');
            const passwordField: FormFieldType | undefined = fields.find((field: FormFieldType): boolean => field.name === 'password');
            if (!passwordRepeatField?.element?.value || passwordRepeatField.element.value !== passwordField?.element?.value) {
                passwordRepeatField?.element?.classList.add('is-invalid');
                isValid = false;
            } else {
                passwordRepeatField.element.classList.remove('is-invalid');
            }
        }
        return isValid;
    }
}