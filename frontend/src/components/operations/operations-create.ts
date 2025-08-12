import {UrlUtils} from "../../utils/url-utils";
import {CategoriesService} from "../../services/categories-service";
import {OperationsService} from "../../services/operations-service";
import {OperationResponseType} from "../../types/operation-response.type";
import {OperationOptionsType} from "../../types/operation-options.type";
import {CategoryPageType} from "../../types/category-page.type";

export class OperationCreate {
    private categoryTypeElement: HTMLInputElement | null = null;
    private categoryListElement: HTMLInputElement | null = null;
    private amountElement: HTMLInputElement | null = null;
    private dateElement: HTMLInputElement | null = null;
    private commentElement: HTMLInputElement | null = null;
    private actionBtn: HTMLElement | null = null;
    private validateFields: HTMLInputElement[] = [];

    constructor() {
        // to fix
        const category: CategoryPageType = UrlUtils.getUrlParam('cat') as CategoryPageType;
        if (!category) {
            location.href = '#/operations';
            return;
        }

        this.findFormElements();

        this.categoryTypeElement?.addEventListener('change', (): string => {
            return location.href = '#/operations/create?cat=' + this.categoryTypeElement?.value;
        });

        this.actionBtn?.addEventListener('click', async (): Promise<void> => {
            if (this.amountElement && this.dateElement) {
                this.validateFields = [
                    this.amountElement,
                    this.dateElement,
                ];
            }

            if (OperationsService.validateForm(this.validateFields)) {
                const operationData: OperationOptionsType = {
                    type: <string>this.categoryTypeElement?.value,
                    amount: parseInt(<string>this.amountElement?.value),
                    date: <string>this.dateElement?.value,
                    comment: this.commentElement?.value ? this.commentElement.value : ' ',
                    category_id: Number(this.categoryListElement?.value),
                };

                const result: OperationResponseType = await OperationsService.saveOperation('POST', operationData);
                if (result) {
                    location.href = '#/operations';
                }
            }
        });

        this.init(category).then();
    };

    private async init(category: CategoryPageType): Promise<void> {
        if (this.categoryTypeElement) {
            this.categoryTypeElement.value = category;
        }
        if (this.categoryListElement) {
            await OperationsService.fillCategories(await CategoriesService.getAllCategories(category), this.categoryListElement);
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