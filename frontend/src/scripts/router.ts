import {Homepage} from "../components/homepage";
import {Incomes} from "../components/incomes/incomes";
import {Expenses} from "../components/expenses/expenses";
import {Operations} from "../components/operations/operations";
import {Form} from "../components/form";
import {Auth} from "../services/auth";
import {config} from "../config/config";
import {CustomHttp} from "../services/custom-http";
import {IncomesEdit} from "../components/incomes/incomes-edit";
import {IncomesDelete} from "../components/incomes/incomes-delete";
import {IncomesCreate} from "../components/incomes/incomes-create";
import {ExpensesCreate} from "../components/expenses/expenses-create";
import {ExpensesEdit} from "../components/expenses/expenses-edit";
import {ExpensesDelete} from "../components/expenses/expenses-delete";
import {OperationCreate} from "../components/operations/operations-create";
import {OperationDelete} from "../components/operations/operations-delete";
import {OperationEdit} from "../components/operations/operations-edit";
import {RouteType} from "../types/route.type";
import {UserInfoType} from "../types/user-info.type";
import {BalanceResponseType} from "../types/balance-response.type";
import {AuthPageType} from "../types/auth/auth-page.type";


export class Router {
    readonly contentPageElement: HTMLElement | null;
    readonly titlePageElement: HTMLElement | null;
    private balanceElement: HTMLInputElement | null;
    private routes: RouteType[];

    constructor() {
        window.addEventListener('DOMContentLoaded', this.openRoute.bind(this));
        window.addEventListener('popstate', this.openRoute.bind(this));

        this.contentPageElement = document.getElementById('content');
        this.titlePageElement = document.getElementById('title');
        this.balanceElement = null;
        this.routes = [
            {
                route: '#/signup',
                title: 'Создание аккаунта',
                template: '/templates/auth/signup.html',
                load: () => {
                    new Form(AuthPageType.signup);
                },
            },
            {
                route: '#/login',
                title: 'Вход в систему',
                template: '/templates/auth/login.html',
                load: () => {
                    new Form(AuthPageType.login);
                },
            },
            {
                route: '#/',
                title: 'Главная',
                useLayout: '/templates/layout.html',
                template: '/templates/homepage.html',
                load: () => {
                    new Homepage();
                },
            },
            {
                route: '#/operations',
                title: 'Доходы и расходы',
                useLayout: '/templates/layout.html',
                template: '/templates/operations/operations.html',
                load: () => {
                    new Operations();
                },
            },
            {
                route: '#/operations/create',
                title: 'Создание дохода/расхода',
                useLayout: '/templates/layout.html',
                template: '/templates/operations/operations-create.html',
                load: () => {
                    new OperationCreate();
                },
            },
            {
                route: '#/operations/edit',
                title: 'Редактирование дохода/расхода',
                useLayout: '/templates/layout.html',
                template: '/templates/operations/operations-edit.html',
                load: () => {
                    new OperationEdit();
                },
            },
            {
                route: '#/operations/delete',
                load: () => {
                    new OperationDelete();
                },
            },
            {
                route: '#/incomes',
                title: 'Доходы',
                useLayout: '/templates/layout.html',
                template: '/templates/incomes/incomes.html',
                load: () => {
                    new Incomes();
                },
            },
            {
                route: '#/incomes/create',
                title: 'Создание категории доходов',
                useLayout: '/templates/layout.html',
                template: '/templates/incomes/incomes-create.html',
                load: () => {
                    new IncomesCreate();
                },
            },
            {
                route: '#/incomes/edit',
                title: 'Редактирование категории доходов',
                useLayout: '/templates/layout.html',
                template: '/templates/incomes/incomes-edit.html',
                load: () => {
                    new IncomesEdit();
                },
            },
            {
                route: '#/incomes/delete',
                load: () => {
                    new IncomesDelete();
                },
            },
            {
                route: '#/expenses',
                title: 'Расходы',
                useLayout: '/templates/layout.html',
                template: '/templates/expenses/expenses.html',
                load: () => {
                    new Expenses();
                },
            },
            {
                route: '#/expenses/create',
                title: 'Создание категории расходов',
                useLayout: '/templates/layout.html',
                template: '/templates/expenses/expenses-create.html',
                load: () => {
                    new ExpensesCreate();
                },
            },
            {
                route: '#/expenses/edit',
                title: 'Редактирование категории расходов',
                useLayout: '/templates/layout.html',
                template: '/templates/expenses/expenses-edit.html',
                load: () => {
                    new ExpensesEdit();
                },
            },
            {
                route: '#/expenses/delete',
                load: () => {
                    new ExpensesDelete();
                },
            },
        ];
    };

    private async openRoute(): Promise<void> {
        let contentBlock: HTMLElement | null = this.contentPageElement;

        const urlRoute: string = window.location.hash.split('?')[0];

        if (urlRoute === '#/logout') {
            await Auth.logout();
            location.href = '#/login';
            return;
        }

        if (!localStorage.getItem(Auth.refreshTokenKey) && !(urlRoute === '#/signup' || urlRoute === '#/login')) {
            history.pushState({}, '', '#/login');
            return this.openRoute();
        }

        const newRoute: RouteType | undefined = this.routes.find(item => item.route === urlRoute);

        if (!newRoute) {
            location.href = '#/login';
            return;
        }

        if (newRoute.useLayout) {
            try {
                if (contentBlock) {
                    contentBlock.innerHTML = await fetch(newRoute.useLayout).then(res => res.text());
                }
                contentBlock = document.getElementById('content-layout');
            } catch (e) {
                console.error(e);
            }

            const categoriesListArrowElement: HTMLElement | null = document.getElementById('categoriesListArrowElement');
            const categoriesListElement: HTMLElement | null = document.getElementById('categoriesListElement');
            categoriesListElement?.addEventListener('click', (): void => {
                categoriesListArrowElement?.classList.toggle('active');
            });

            const mainNavLinks: HTMLAreaElement[] = Array.from(document.querySelectorAll('.main-link'));
            let activeLink: HTMLAreaElement | undefined = mainNavLinks.find(link => link.hash === newRoute.route);
            if (!activeLink) {
                activeLink = mainNavLinks.find((link: HTMLAreaElement) => link.hash === ('#/' + newRoute.route.split('/')[1]));
            }
            if (activeLink) {
                activeLink.classList.add('active');
                if (newRoute.route.includes('#/incomes') || newRoute.route.includes('#/expenses')) {
                    const layoutLinksListElement = document.getElementById('categoriesListElement');

                    layoutLinksListElement?.classList.add('active');
                    categoriesListArrowElement?.classList.add('active');
                    layoutLinksListElement?.nextElementSibling?.classList.add('show');
                }
            }

            const userInfo: UserInfoType | null = Auth.getUserInfo();
            const userNameElement: HTMLElement | null = document.getElementById('userName');
            if (userNameElement) {
                userNameElement.innerText = userInfo?.name + ' ' + userInfo?.lastName;
            }

            this.balanceElement = document.getElementById('balance') as HTMLInputElement;
            await this.updateBalance();
            const balanceActionElement: HTMLElement | null = document.getElementById('balance-action');
            if (balanceActionElement) {
                balanceActionElement.addEventListener('click', async (): Promise<void> => {
                    const balanceInputElement: HTMLInputElement | null = document.getElementById('balance-input') as HTMLInputElement;
                    // const balanceInputElement: HTMLElement | null = document.getElementById('balance-input');
                    if (balanceInputElement) {
                        const result: BalanceResponseType = await CustomHttp.request(config.host + '/balance', 'PUT', {
                            newBalance: balanceInputElement.value,
                            // newBalance: balanceInputElement.getAttribute('value'),
                        });
                        if (result && result.balance) {
                            await this.updateBalance(result.balance);
                        }
                    }
                });
            }
        }

        if (newRoute.title && this.titlePageElement) {
            this.titlePageElement.innerText = newRoute.title;
        }

        if (newRoute.route.split('/').at(-1) !== 'delete') {
            try {
                if (contentBlock && newRoute.template) {
                    contentBlock.innerHTML = await fetch(newRoute.template).then(res => res.text());
                }
            } catch (e) {
                console.error(e);
            }
        }

        newRoute.load();
    }

    private async updateBalance(balance: number | null = null): Promise<void> {
        if (this.balanceElement) {
            if (balance) {
                this.balanceElement.innerHTML = balance + '$';
            } else {
                const result: BalanceResponseType = await CustomHttp.request(config.host + '/balance');
                if (result) {
                    this.balanceElement.innerHTML = result.balance + '$';
                }
            }
        }
    }
}


