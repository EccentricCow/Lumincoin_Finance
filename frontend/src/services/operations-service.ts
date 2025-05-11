import {CustomHttp} from "./custom-http";
import {config} from "../config/config";
import {GetOperationsParamsType} from "../types/get-operations-params.type";
import {OperationResponseType} from "../types/operation-response.type";
import {DefaultResponseType} from "../types/default-response.type";
import {CategoryType} from "../types/category.type";
import {OperationOptionsType} from "../types/operation-options.type";

export class OperationsService {

    public static async getOperations(params?: GetOperationsParamsType[]): Promise<OperationResponseType[]> {
        let url: string = config.host + '/operations';
        if (params) {
            url += '?';
            for (let i: number = 0; i < params.length; i++) {
                url += (params.length - i === 1) ? (params[i].nameParam + '=' + params[i].valueParam)
                    : (params[i].nameParam + '=' + params[i].valueParam + '&');
            }
        }

        const result: OperationResponseType[] | DefaultResponseType = await CustomHttp.request(url);
        if ((result as DefaultResponseType).error !== undefined) {
            throw new Error((result as DefaultResponseType).message);
        }

        return result as OperationResponseType[];

    };

    public static async getOperation(id: string): Promise<OperationResponseType> {
        const result: OperationResponseType | DefaultResponseType = await CustomHttp.request(config.host + '/operations/' + id);
        if ((result as DefaultResponseType).error !== undefined) {
            throw new Error((result as DefaultResponseType).message);
        }

        return result as OperationResponseType;
    }

    public static validateForm(fields: HTMLInputElement[]): boolean {
        let isValid: boolean = true;
        fields.forEach((field: HTMLInputElement): void => {
            if (!field.value) {
                field.classList.add('is-invalid');
                isValid = false;
            } else {
                field.classList.remove('is-invalid');
            }
        });
        return isValid;
    };

    public static async fillCategories(allCategoryName: CategoryType[], listCategoriesElement: HTMLElement): Promise<HTMLElement[]> {
        const optionsArray: HTMLElement[] = [];
        if (allCategoryName && allCategoryName.length > 0) {
            allCategoryName.forEach(category => {
                const categoryOption: HTMLOptionElement = document.createElement('option');
                categoryOption.innerText = category.title;
                categoryOption.value = category.id.toString();
                listCategoriesElement.appendChild(categoryOption);
                optionsArray.push(categoryOption);
            });
        }
        return optionsArray;
    };

    public static async saveOperation(method: string, operationData: OperationOptionsType, id?: string | null): Promise<OperationResponseType> {
        const url: string = id ? config.host + '/operations/' + id : config.host + '/operations';
        const result: OperationResponseType | DefaultResponseType = await CustomHttp.request(url, method, operationData);

        if ((result as DefaultResponseType).error !== undefined) {
            throw new Error((result as DefaultResponseType).message);
        }

        return result as OperationResponseType;
    };
}