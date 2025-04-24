import {CategoriesService} from "../../services/categories-service";
import {UrlUtils} from "../../utils/url-utils";

export class IncomesDelete {
    constructor() {

        this.init('income').then();
    }

    async init(category) {

        const id = UrlUtils.getUrlParam('id');
        await CategoriesService.deleteCategory(id, category);
        location.href = '#/' + category + 's';
    };
}