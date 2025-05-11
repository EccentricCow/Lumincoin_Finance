import Chart from 'chart.js/auto';
import {FilterByDateService} from "../services/filter-by-date-service";
import {OperationsService} from "../services/operations-service";
import {OperationResponseType} from "../types/operation-response.type";
import {OperationItemType} from "../types/operation-item.type";
import {GetOperationsParamsType} from "../types/get-operations-params.type";

export class Homepage {
    private incomesPieData: OperationItemType[];
    private expensesPieData: OperationItemType[];

    constructor() {
        this.incomesPieData = [];
        this.expensesPieData = [];

        this.init().then();

        const timeFilter = new FilterByDateService();
        timeFilter.filterParamElements?.forEach((filterBtn: HTMLElement): void => {
                filterBtn.addEventListener('click', async (): Promise<void> => {
                    const filterElements: GetOperationsParamsType[] | null = await timeFilter.activateFilterElements(filterBtn);
                    if (filterElements) {
                        this.init(filterElements).then();
                    }
                });
            }
        );
    };

    private async init(params?: GetOperationsParamsType[]): Promise<void> {
        const operations: OperationResponseType[] = await OperationsService.getOperations(params);
        if (operations && operations.length > 0) {
            operations.forEach((operation: OperationResponseType): void => {
                this.calculateDataPies(operation);
            });
        }
        this.activatePies();
    };

    private calculateDataPies(operation: OperationResponseType): void {
        const operationItem: OperationItemType = {
            category: operation.category,
            amount: operation.amount,
        };
        let similarField: OperationItemType | undefined;
        if (operation.type === 'income') {
            similarField = this.incomesPieData.find((item: OperationItemType): boolean => item.category === operation.category);
            similarField ? similarField.amount += operation.amount : this.incomesPieData.push(operationItem);
        } else {
            similarField = this.expensesPieData.find((item: OperationItemType): boolean => item.category === operation.category);
            similarField ? similarField.amount += operation.amount : this.expensesPieData.push(operationItem);
        }
    };

    private activatePies(): void {
        const incomesPie: HTMLCanvasElement | null = document.getElementById('incomesPie') as HTMLCanvasElement;
        const expensesPie: HTMLCanvasElement | null = document.getElementById('expensesPie') as HTMLCanvasElement;

        if (Chart.getChart('incomesPie')) {
            Chart.getChart('incomesPie')?.destroy();
        }
        if (Chart.getChart('expensesPie')) {
            Chart.getChart('expensesPie')?.destroy();
        }

        if (incomesPie) {
            new Chart(incomesPie, {
                type: 'pie',
                data: {
                    labels: this.incomesPieData.map(item => item.category),
                    datasets: [
                        {
                            data: this.incomesPieData.map(item => item.amount),
                        },
                    ],
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                padding: 15,
                                boxWidth: 35,
                                boxHeight: 10,
                                font: {
                                    family: 'Roboto',
                                    weight: 500,
                                    size: 14,
                                },
                            },
                        },
                    }
                },
            });
        }

        if (expensesPie) {
            new Chart(expensesPie, {
                type: 'pie',
                data: {
                    labels: this.expensesPieData.map(item => item.category),
                    datasets: [
                        {
                            data: this.expensesPieData.map(item => item.amount),
                        },
                    ],
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                padding: 15,
                                boxWidth: 35,
                                boxHeight: 10,
                                font: {
                                    family: 'Roboto',
                                    weight: 500,
                                    size: 14,
                                },
                            },
                        },
                    }
                },
            });
        }
    };
}