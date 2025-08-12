import {CategoriesService} from "../../services/categories-service";
import {CategoryPageType} from "../../types/category-page.type";

export class ExpensesCreate {
    private categoryInputElement: HTMLInputElement | null;

    constructor() {
        this.categoryInputElement = document.getElementById('categoryName') as HTMLInputElement;
        document.getElementById('action')?.addEventListener('click', async (): Promise<void> => {
            if (this.categoryInputElement?.value) {
                await CategoriesService.createCategory(this.categoryInputElement.value, CategoryPageType.expense);
            }
        });
    };
}