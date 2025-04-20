import {Homepage} from "../components/homepage";
import {Incomes} from "../components/incomes/incomes";
import {Expenses} from "../components/expenses/expenses";
import {Operations} from "../components/operations";
import {Form} from "../components/form";
import {Auth} from "../services/auth";

export class Router {
    constructor() {
        window.addEventListener('DOMContentLoaded', this.openRoute.bind(this));
        window.addEventListener('popstate', this.openRoute.bind(this));

        this.contentPageElement = document.getElementById('content');
        this.titlePageElement = document.getElementById('title');

        this.routes = [
            {
                route: '#/signup',
                title: 'Создание аккаунта',
                template: '/templates/auth/signup.html',
                load: () => {
                    new Form('signup');
                },
            },
            {
                route: '#/login',
                title: 'Вход в систему',
                template: '/templates/auth/login.html',
                load: () => {
                    new Form('login');
                },
            },
            {
                route: '#/404',
                title: '404',
                template: '/templates/404.html',
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

                },
            },
            {
                route: '#/operations/edit',
                title: 'Редактирование дохода/расхода',
                useLayout: '/templates/layout.html',
                template: '/templates/operations/operations-edit.html',
                load: () => {

                },
            },
            {
                route: '#/operations/delete',
                load: () => {

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

                },
            },
            {
                route: '#/incomes/edit',
                title: 'Редактирование категории доходов',
                useLayout: '/templates/layout.html',
                template: '/templates/incomes/incomes-edit.html',
                load: () => {

                },
            },
            {
                route: '#/incomes/delete',
                load: () => {

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

                },
            },
            {
                route: '#/expenses/edit',
                title: 'Редактирование категории расходов',
                useLayout: '/templates/layout.html',
                template: '/templates/expenses/expenses-edit.html',
                load: () => {

                },
            },
            {
                route: '#/expenses/delete',
                load: () => {

                },
            },
        ];
    };

    async openRoute() {
        let contentBlock = this.contentPageElement;

        // const urlRoute = window.location.hash.split('?')[0];
        const urlRoute = window.location.hash;
        if (urlRoute === '#/logout') {
            await Auth.logout();
            window.location.href = '#/login';
            return;
        }
        const newRoute = this.routes.find(item => item.route === urlRoute);

        if (!newRoute) {
            window.location.href = '#/404';
            return;
        }

        if (newRoute.useLayout) {
            try {
                contentBlock.innerHTML = await fetch(newRoute.useLayout).then(res => res.text());
                contentBlock = document.getElementById('content-layout');
            } catch (e) {
                console.error(e);
            }

            const categoriesListArrowElement = document.getElementById('categoriesListArrowElement');
            document.getElementById('categoriesListElement').addEventListener('click', () => {
                categoriesListArrowElement.classList.toggle('active');
            });

            const mainNavLinks = Array.from(document.querySelectorAll('.main-link'));
            let activeLink = mainNavLinks.find(link => link.hash === newRoute.route);
            if (!activeLink) {
                activeLink = mainNavLinks.find(link => link.hash === ('#/' + newRoute.route.split('/')[1]));
            }
            if (activeLink) {
                activeLink.classList.add('active');
                if (newRoute.route.includes('#/incomes') || newRoute.route.includes('#/expenses')) {
                    const layoutLinksListElement = document.getElementById('categoriesListElement');

                    layoutLinksListElement.classList.add('active');
                    categoriesListArrowElement.classList.add('active');
                    layoutLinksListElement.nextElementSibling.classList.add('show');
                }
            }
        }

        try {
            contentBlock.innerHTML = await fetch(newRoute.template).then(res => res.text());
            this.titlePageElement.innerText = newRoute.title;
            newRoute.load();
        } catch (e) {
            console.error(e);
        }
    }
}


