import {CategoriesService} from "../../services/categories-service";

export class ExpensesCreate {
    constructor() {
        this.categoryInputElement = document.getElementById('categoryName');
        document.getElementById('action').addEventListener('click', async () => {
            await CategoriesService.createCategory(this.categoryInputElement.value, 'expense');
        });
    };
}