import {CategoriesService} from "../../services/categories-service";
import {UrlUtils} from "../../utils/url-utils";
import {CategoryPageType} from "../../types/category-page.type";
import {CategoryType} from "../../types/category.type";

export class ExpensesEdit {
    private categoryInputElement: HTMLInputElement | null;

    constructor() {
        this.categoryInputElement = document.getElementById('categoryName') as HTMLInputElement;
        this.init().then();
    }

    private async init(): Promise<void> {
        const id: string | null = UrlUtils.getUrlParam('id');
        if (!id) {
            return;
        }

        const result: CategoryType = await CategoriesService.getCategory(id, CategoryPageType.expense);

        if ((result as CategoryType).title) {
            this.categoryInputElement?.setAttribute('value', (result as CategoryType).title);
        }

        document.getElementById('saveChangesBtn')?.addEventListener('click', async (): Promise<void> => {
            if (this.categoryInputElement?.value && this.categoryInputElement.value !== (result as CategoryType).title) {
                await CategoriesService.editCategory(id, this.categoryInputElement.value, CategoryPageType.expense);
            }
        });
    };
}