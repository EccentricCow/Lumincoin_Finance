import {CategoryPageType} from "./category-page.type";

export type OperationResponseType = {
    id: number,
    type: string,
    amount: number,
    date: string,
    comment: string,
    category: CategoryPageType,
}
