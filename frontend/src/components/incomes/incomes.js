import {CategoriesService} from "../../services/categories-service";

export class Incomes {
    constructor() {
        document.getElementById('add-incomes-element').addEventListener('click', (e) => {
            location.href = '#/incomes/create';
        });
        const deleteElement = document.getElementById('deleteBtn');
        this.init('income').then();

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