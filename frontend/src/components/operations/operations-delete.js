import {UrlUtils} from "../../utils/url-utils";
import {CustomHttp} from "../../services/custom-http";
import {config} from "../../config/config";

export class OperationDelete {
    constructor() {
        this.init().then();
    }

    async init() {
        await CustomHttp.request(config.host + '/operations/' + UrlUtils.getUrlParam('id'), 'DELETE');
        location.href = '#/operations';
    };
}