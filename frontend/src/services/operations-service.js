import {CustomHttp} from "./custom-http";
import {config} from "../config/config";

export class OperationsService {

    static async getOperations(params) {
        let url = config.host + '/operations';
        if (params) {
            url += '?';
            for (let i = 0; i < params.length; i++) {
                url += (params.length - i === 1) ? (params[i].nameParam + '=' + params[i].valueParam)
                    : (params[i].nameParam + '=' + params[i].valueParam + '&');
            }
        }

        const result = await CustomHttp.request(url);
        if (result && !result.error) {
            return result;
        }
    };

    static async getOperation(id) {
        const result = await CustomHttp.request(config.host + '/operations/' + id);
        if (result && !result.error) {
            return result;
        }
    }

    static validateForm(fields) {
        let isValid = true;
        fields.forEach(field => {
            if (!field.value) {
                field.classList.add('is-invalid');
                isValid = false;
            } else {
                field.classList.remove('is-invalid');
            }
        });
        return isValid;
    };

    static async fillCategories(allCategoryName, listCategoriesElement) {
        const optionsArray = [];
        if (allCategoryName && allCategoryName.length > 0) {
            allCategoryName.forEach(category => {
                const categoryOption = document.createElement('option');
                categoryOption.innerText = category.title;
                categoryOption.value = category.id;
                listCategoriesElement.appendChild(categoryOption);
                optionsArray.push(categoryOption);
            });
        }
        return optionsArray;
    };

    static async saveOperation(method, operationData, id = null) {
        const url = id ? config.host + '/operations/' + id : config.host + '/operations';
        return CustomHttp.request(url, method, operationData);
    };
}