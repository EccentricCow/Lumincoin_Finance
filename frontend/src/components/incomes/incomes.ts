import {CategoriesService} from "../../services/categories-service";
import {CategoryPageType} from "../../types/category-page.type";
import {CategoryType} from "../../types/category.type";

export class Incomes {
    constructor() {
        document.getElementById('add-incomes-element')?.addEventListener('click', (): void => {
            window.location.href = '#/incomes/create';
        });

        const deleteElement: HTMLElement | null = document.getElementById('deleteBtn');
        this.init(CategoryPageType.income).then();

        document.getElementById('confirmDelete')?.addEventListener('show.bs.modal', function (): void {
            if (deleteElement) {
                deleteElement.onclick = (): void => {
                    document.getElementById('modalClose')?.click();
                };
            }
        });
    }

    private async init(category: CategoryPageType): Promise<void> {
        const result: CategoryType[] = await CategoriesService.getAllCategories(category);

        if ((result as CategoryType[]).length > 0) {
            await CategoriesService.showCategories(result as CategoryType[], category);
        }
    };
}