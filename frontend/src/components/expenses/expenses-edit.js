import {CategoriesService} from "../../services/categories-service";
import {UrlUtils} from "../../utils/url-utils";

export class ExpensesEdit {
    constructor() {
        this.categoryInputElement = document.getElementById('categoryName');
        this.init().then();
    }

    async init() {
        const id = UrlUtils.getUrlParam('id');
        const categoryInfo = await CategoriesService.getCategory(id, 'expense');

        if (categoryInfo && categoryInfo.title) {
            this.categoryInputElement.setAttribute('value', categoryInfo.title);
        }

        document.getElementById('saveChangesBtn').addEventListener('click', async () => {
            if (this.categoryInputElement.value && this.categoryInputElement.value !== categoryInfo.title) {
                await CategoriesService.editCategory(id, this.categoryInputElement.value, 'expense');
            }
        });
    };
}