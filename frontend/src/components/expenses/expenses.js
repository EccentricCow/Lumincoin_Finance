import {CategoriesService} from "../../services/categories-service";

export class Expenses {
    constructor() {
        document.getElementById('add-expenses-element').addEventListener('click', (e) => {
            window.location.href = '#/expenses/create';
        });

        const deleteElement = document.getElementById('deleteBtn');
        this.init('expense').then();

        document.getElementById('confirmDelete').addEventListener('show.bs.modal', function (event) {
            deleteElement.onclick = () => {
                document.getElementById('modalClose').click();
            };
        });
    }

    async init(category) {
        const categories = await CategoriesService.getAllCategories(category);
        if (categories && !categories.error && categories.length > 0) {
            await CategoriesService.showCategories(categories, category);
        }
    };
}