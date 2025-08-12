import {CustomHttp} from "./custom-http";
import {config} from "../config/config";
import {CategoryPageType} from "../types/category-page.type";
import {DefaultResponseType} from "../types/default-response.type";
import {CategoryType} from "../types/category.type";

export class CategoriesService {

    public static async deleteCategory(id: string | null, category: CategoryPageType): Promise<void> {
        await CustomHttp.request(config.host + '/categories/' + category + '/' + id, 'DELETE');
    };

    public static async createCategory(categoryName: string, categoryType: CategoryPageType): Promise<void> {
        const result: CategoryType | DefaultResponseType = await CustomHttp.request(config.host + '/categories/' + categoryType, 'POST', {
            title: categoryName,
        });

        if ((result as DefaultResponseType).error !== undefined) {
            throw new Error((result as DefaultResponseType).message);
        }

        if ((result as CategoryType).title) {
            location.href = '#/' + categoryType + 's';
        }
    };

    public static async editCategory(id: string, newCategoryName: string, category: CategoryPageType): Promise<CategoryType> {
        const result: CategoryType | DefaultResponseType = await CustomHttp.request(config.host + '/categories/' + category + '/' + id, 'PUT', {
            title: newCategoryName,
        });
        if ((result as DefaultResponseType).error !== undefined) {
            throw new Error((result as DefaultResponseType).message);
        }
        return result as CategoryType;
    };

    public static async getCategory(id: string, category: CategoryPageType): Promise<CategoryType> {
        const result: CategoryType | DefaultResponseType = await CustomHttp.request(config.host + '/categories/' + category + '/' + id);

        if ((result as DefaultResponseType).error !== undefined) {
            throw new Error((result as DefaultResponseType).message);
        }

        return (result as CategoryType);
    };

    public static async showCategories(categories: CategoryType[], category: CategoryPageType): Promise<void> {
        const categoriesListElement: HTMLElement | null = document.getElementById('categoriesNameList');
        if (!categoriesListElement) {
            return;
        }

        categories.forEach((item: CategoryType): void => {
            const categoryElement: HTMLDivElement = document.createElement('div');
            categoryElement.classList.add('col-12', 'col-lg-4', 'col-md-6', 'mb-3', 'pb-3');

            const categoryCard: HTMLDivElement = document.createElement('div');
            categoryCard.classList.add('card');

            const categoryBody: HTMLDivElement = document.createElement('div');
            categoryBody.classList.add('card-body', 'p-3', 'm-3');

            const categoryTitle: HTMLHeadingElement = document.createElement('h3');
            categoryTitle.classList.add('card-title', 'mb-3');
            categoryTitle.innerText = item.title;

            const categoryActionsInner: HTMLDivElement = document.createElement('div');

            const categoryEditBtn: HTMLAnchorElement = document.createElement('a');
            categoryEditBtn.classList.add('btn', 'btn-primary', 'me-4');
            categoryEditBtn.setAttribute('href', '#/' + category + 's/edit' + '?id=' + item.id);
            categoryEditBtn.innerText = 'Редактировать';

            const categoryDeleteBtn: HTMLAnchorElement = document.createElement('a');
            categoryDeleteBtn.classList.add('btn', 'btn-danger');
            categoryDeleteBtn.setAttribute('data-bs-toggle', 'modal');
            categoryDeleteBtn.setAttribute('data-bs-target', '#confirmDelete');
            categoryDeleteBtn.innerText = 'Удалить';

            categoryDeleteBtn.addEventListener('click', (): void => {
                document.getElementById('deleteBtn')?.setAttribute('href', '#/' + category + 's/delete' + '?id=' + item.id);
            });

            categoryActionsInner.appendChild(categoryEditBtn);
            categoryActionsInner.appendChild(categoryDeleteBtn);
            categoryBody.appendChild(categoryTitle);
            categoryBody.appendChild(categoryActionsInner);
            categoryCard.appendChild(categoryBody);
            categoryElement.appendChild(categoryCard);
            categoriesListElement.prepend(categoryElement);
        });
    };

    static async getAllCategories(category: CategoryPageType): Promise<CategoryType[]> {
        const result: CategoryType[] | DefaultResponseType = await CustomHttp.request(config.host + '/categories/' + category);

        if ((result as DefaultResponseType).error !== undefined) {
            throw new Error((result as DefaultResponseType).message);
        }

        return (result as CategoryType[]);
    };
}