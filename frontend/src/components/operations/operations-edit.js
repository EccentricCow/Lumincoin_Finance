import {UrlUtils} from "../../utils/url-utils";
import {CategoriesService} from "../../services/categories-service";
import {OperationsService} from "../../services/operations-service";

export class OperationEdit {
    constructor() {
        this.findFormElements();

        this.init().then();
    };

    async init() {
        const id = UrlUtils.getUrlParam('id');
        this.operation = await OperationsService.getOperation(id);
        if (this.operation && !this.operation.error) {
            const categoryOptionElements = await OperationsService.fillCategories(await CategoriesService.getAllCategories(this.operation.type), this.categoryListElement);
            await this.fillFormElements(this.operation, categoryOptionElements);
        }

        this.categoryTypeElement.addEventListener('change', async (e) => {
            this.categoryListElement.innerHTML = '';
            await OperationsService.fillCategories(await CategoriesService.getAllCategories(e.target.value), this.categoryListElement);
        });

        this.actionBtn.addEventListener('click', async () => {
            await this.processEdit(id);
        });
    };

    async processEdit(id) {
        this.fields = [
            this.amountElement,
            this.dateElement,
        ];

        if (OperationsService.validateForm(this.fields)) {
            const operationData = {
                type: this.categoryTypeElement.value,
                amount: this.amountElement.value,
                date: this.dateElement.value,
                comment: this.commentElement.value ? this.commentElement.value : ' ',
                category_id: Number(this.categoryListElement.value),
            };

            // this.operation.type !== this.categoryTypeElement.value ? operationData.type = this.categoryTypeElement.value : '';
            // this.operation.amount !== Number(this.amountElement.value) ? operationData.amount = Number(this.amountElement.value) : '';
            // this.operation.date !== this.dateElement.value ? operationData.date = this.dateElement.value : '';
            // this.operation.comment !== this.commentElement.value ? operationData.comment = this.commentElement.value : '';
            // this.operation.category !== this.categoryListElement[this.categoryListElement.selectedIndex].text ? operationData.category_id = Number(this.categoryListElement.value) : '';

            const result = await OperationsService.saveOperation('PUT', operationData, id);
            if (result && !result.error) {
                location.href = '#/operations';
            }
        }
    };

    async fillFormElements(operation, categoryOptionElements) {
        this.categoryTypeElement.value = operation.type;
        categoryOptionElements.forEach(category => {
            if (category.innerText === operation.category) {
                category.selected = true;
            }
        });
        this.amountElement.value = operation.amount;
        this.dateElement.value = operation.date;
        this.commentElement.value = operation.comment;
    };

    findFormElements() {
        this.categoryTypeElement = document.getElementById('type');
        this.categoryListElement = document.getElementById('categoryList');
        this.amountElement = document.getElementById('amount');
        this.dateElement = document.getElementById('date');
        this.commentElement = document.getElementById('comment');
        this.actionBtn = document.getElementById('action');

        this.fields = [];
    };
}