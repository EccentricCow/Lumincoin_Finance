import {UrlUtils} from "../../utils/url-utils";
import {CategoriesService} from "../../services/categories-service";
import {OperationsService} from "../../services/operations-service";

export class OperationCreate {
    constructor() {
        const category = UrlUtils.getUrlParam('cat');
        if (!category) {
            location.href = '#/operations';
        }

        this.findFormElements();

        this.categoryTypeElement.addEventListener('change', (e) => {
            return location.href = '#/operations/create?cat=' + this.categoryTypeElement.value;
        });

        this.actionBtn.addEventListener('click', async () => {
            this.validateFields = [
                this.amountElement,
                this.dateElement,
            ];

            if (OperationsService.validateForm(this.validateFields)) {
                const operationData = {
                    type: this.categoryTypeElement.value,
                    amount: this.amountElement.value,
                    date: this.dateElement.value,
                    comment: this.commentElement.value ? this.commentElement.value : ' ',
                    category_id: Number(this.categoryListElement.value),
                };

                const result = await OperationsService.saveOperation('POST', operationData);
                if (result && !result.error) {
                    location.href = '#/operations';
                }
            }
        });

        this.init(category).then();
    };

    async init(category) {
        this.categoryTypeElement.value = category;
        await OperationsService.fillCategories(await CategoriesService.getAllCategories(category), this.categoryListElement);
    };

    findFormElements() {
        this.categoryTypeElement = document.getElementById('type');
        this.categoryListElement = document.getElementById('categoryList');
        this.amountElement = document.getElementById('amount');
        this.dateElement = document.getElementById('date');
        this.commentElement = document.getElementById('comment');
        this.actionBtn = document.getElementById('action');

        this.validateFields = [];
    };
}