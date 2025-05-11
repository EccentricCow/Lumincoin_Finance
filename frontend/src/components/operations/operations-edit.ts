import {UrlUtils} from "../../utils/url-utils";
import {CategoriesService} from "../../services/categories-service";
import {OperationsService} from "../../services/operations-service";
import {OperationResponseType} from "../../types/operation-response.type";
import {CategoryPageType} from "../../types/category-page.type";

export class OperationEdit {
    private categoryTypeElement: HTMLInputElement | null = null;
    private categoryListElement: HTMLInputElement | null = null;
    private amountElement: HTMLInputElement | null = null;
    private dateElement: HTMLInputElement | null = null;
    private commentElement: HTMLInputElement | null = null;
    private actionBtn: HTMLElement | null = null;
    private operation: OperationResponseType | null = null;

    private fields: HTMLInputElement[] = [];

    constructor() {
        this.findFormElements();
        this.init().then();
    };

    private async init(): Promise<void> {
        const id: string | null = UrlUtils.getUrlParam('id');
        if (!id) {
            return;
        }

        this.operation = await OperationsService.getOperation(id);
        if (this.categoryListElement) {
            const categoryOptionElements: HTMLElement[] = await OperationsService.fillCategories(await CategoriesService.getAllCategories(this.operation.type as CategoryPageType), this.categoryListElement);
            await this.fillFormElements(this.operation, categoryOptionElements);
        }

        this.categoryTypeElement?.addEventListener('change', async (e: Event): Promise<void> => {
            (this.categoryListElement as HTMLElement).innerHTML = '';
            if (this.categoryListElement) {
                await OperationsService.fillCategories(
                    await CategoriesService.getAllCategories(((e.target as HTMLInputElement)?.value) as CategoryPageType), this.categoryListElement
                );
            }
        });

        this.actionBtn?.addEventListener('click', async (): Promise<void> => {
            await this.processEdit(id);
        });
    };

    private async processEdit(id: string): Promise<void> {
        if (this.amountElement && this.dateElement) {
            this.fields = [
                this.amountElement,
                this.dateElement,
            ];
        }

        if (OperationsService.validateForm(this.fields)) {
            const operationData = {
                type: <string>this.categoryTypeElement?.value,
                amount: parseInt(<string>this.amountElement?.value),
                date: <string>this.dateElement?.value,
                comment: this.commentElement?.value ? this.commentElement.value : ' ',
                category_id: Number(this.categoryListElement?.value),
            };

            // this.operation.type !== this.categoryTypeElement.value ? operationData.type = this.categoryTypeElement.value : '';
            // this.operation.amount !== Number(this.amountElement.value) ? operationData.amount = Number(this.amountElement.value) : '';
            // this.operation.date !== this.dateElement.value ? operationData.date = this.dateElement.value : '';
            // this.operation.comment !== this.commentElement.value ? operationData.comment = this.commentElement.value : '';
            // this.operation.category !== this.categoryListElement[this.categoryListElement.selectedIndex].text ? operationData.category_id = Number(this.categoryListElement.value) : '';

            const result: OperationResponseType = await OperationsService.saveOperation('PUT', operationData, id);
            if (result) {
                location.href = '#/operations';
            }
        }
    };

    private async fillFormElements(operation: OperationResponseType, categoryOptionElements: HTMLElement[]) {
        if (this.categoryTypeElement) {
            this.categoryTypeElement.value = operation.type;
        }
        categoryOptionElements.forEach((category: HTMLElement): void => {
            if (category.innerText === operation.category) {
                (category as HTMLOptionElement).selected = true;
            }
        });
        if (this.amountElement) {
            this.amountElement.value = String(operation.amount);
        }
        if (this.dateElement) {
            this.dateElement.value = operation.date;
        }
        if (this.commentElement) {
            this.commentElement.value = operation.comment;
        }
    };

    private findFormElements(): void {
        this.categoryTypeElement = document.getElementById('type') as HTMLInputElement;
        this.categoryListElement = document.getElementById('categoryList') as HTMLInputElement;
        this.amountElement = document.getElementById('amount') as HTMLInputElement;
        this.dateElement = document.getElementById('date') as HTMLInputElement;
        this.commentElement = document.getElementById('comment') as HTMLInputElement;
        this.actionBtn = document.getElementById('action');

    };
}