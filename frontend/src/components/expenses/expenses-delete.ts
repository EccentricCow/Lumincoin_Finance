import {CategoriesService} from "../../services/categories-service";
import {UrlUtils} from "../../utils/url-utils";
import {CategoryPageType} from "../../types/category-page.type";

export class ExpensesDelete {
    constructor() {
        this.init(CategoryPageType.expense).then();
    }

    private async init(category: CategoryPageType): Promise<void> {
        const id: string | null = UrlUtils.getUrlParam('id');
        await CategoriesService.deleteCategory(id, category);
        location.href = '#/' + category + 's';
    };
}