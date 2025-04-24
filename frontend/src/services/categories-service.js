import {CustomHttp} from "./custom-http";
import {config} from "../config/config";

export class CategoriesService {

    static async deleteCategory(id, category) {
        return await CustomHttp.request(config.host + '/categories/' + category + '/' + id, 'DELETE');
    };

    static async createCategory(categoryName, categoryType) {
        const result = await CustomHttp.request(config.host + '/categories/' + categoryType, 'POST', {
            title: categoryName,
        });
        if (result && result.title) {
            location.href = '#/' + categoryType + 's';
        }
    };

    static async editCategory(id, newCategoryName, category) {
        const result = await CustomHttp.request(config.host + '/categories/' + category + '/' + id, 'PUT', {
            title: newCategoryName,
        });
        if (!result || result.error) {
            throw new Error('Change error');
        }
    };

    static async getCategory(id, category) {
        const result = await CustomHttp.request(config.host + '/categories/' + category + '/' + id);
        if (result && result.title) {
            return result;
        }
    };

    static async showCategories(categories, category) {
        const categoriesListElement = document.getElementById('categoriesNameList');
        categories.forEach(item => {
            const categoryElement = document.createElement('div');
            categoryElement.classList.add('col-12', 'col-lg-4', 'col-md-6', 'mb-3', 'pb-3');

            const categoryCard = document.createElement('div');
            categoryCard.classList.add('card');

            const categoryBody = document.createElement('div');
            categoryBody.classList.add('card-body', 'p-3', 'm-3');

            const categoryTitle = document.createElement('h3');
            categoryTitle.classList.add('card-title', 'mb-3');
            categoryTitle.innerText = item.title;

            const categoryActionsInner = document.createElement('div');

            const categoryEditBtn = document.createElement('a');
            categoryEditBtn.classList.add('btn', 'btn-primary', 'me-4');
            categoryEditBtn.setAttribute('href', '#/' + category + 's/edit' + '?id=' + item.id);
            categoryEditBtn.innerText = 'Редактировать';

            const categoryDeleteBtn = document.createElement('a');
            categoryDeleteBtn.classList.add('btn', 'btn-danger');
            categoryDeleteBtn.setAttribute('data-bs-toggle', 'modal');
            categoryDeleteBtn.setAttribute('data-bs-target', '#confirmDelete');
            categoryDeleteBtn.innerText = 'Удалить';

            categoryDeleteBtn.addEventListener('click', () => {
                document.getElementById('deleteBtn').setAttribute('href', '#/' + category + 's/delete' + '?id=' + item.id);
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

    static async getAllCategories(category) {
        const result = await CustomHttp.request(config.host + '/categories/' + category);
        if (result && !result.error) {
            return result;
        }
    };
}