import Chart from 'chart.js/auto';
import {FilterByDateService} from "../services/filter-by-date-service";
import {OperationsService} from "../services/operations-service";

export class Homepage {
    constructor() {
        this.incomesPieData = [];
        this.expensesPieData = [];
        this.init().then();
        const timeFilter = new FilterByDateService();
        timeFilter.filterParamElements.forEach(filterBtn => {
                filterBtn.addEventListener('click', async (e) => {
                    this.init(await timeFilter.activateFilterElements(filterBtn)).then();
                });
            }
        );
    };

    async init(params) {
        const operations = await OperationsService.getOperations(params);
        if (operations && operations.length > 0) {
            operations.forEach(operation => {
                this.calculateDataPies(operation);
            });
        }
        this.activatePies();
    };

    calculateDataPies(operation) {
        const operationItem = {
            category: operation.category,
            amount: operation.amount,
        };
        let similarField = null;
        if (operation.type === 'income') {
            similarField = this.incomesPieData.find(item => item.category === operation.category);
            similarField ? similarField.amount += operation.amount : this.incomesPieData.push(operationItem);
        } else {
            similarField = this.expensesPieData.find(item => item.category === operation.category);
            similarField ? similarField.amount += operation.amount : this.expensesPieData.push(operationItem);
        }
    };

    activatePies() {
        const incomesPie = document.getElementById('incomesPie');
        const expensesPie = document.getElementById('expensesPie');

        if (Chart.getChart('incomesPie')) {
            Chart.getChart('incomesPie').destroy();
        }
        if (Chart.getChart('expensesPie')) {
            Chart.getChart('expensesPie').destroy();
        }

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
    };
}