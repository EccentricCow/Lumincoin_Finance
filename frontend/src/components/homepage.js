import * as tempusDominus from "@eonasdan/tempus-dominus";
import Chart from 'chart.js/auto';

export class Homepage {
    constructor() {
        this.init().then();

    }

    async init() {
        new tempusDominus.TempusDominus(document.getElementById('datetimepicker1'));
        new tempusDominus.TempusDominus(document.getElementById('datetimepicker2'));

        const incomesPie = document.getElementById('incomesPie');
        const data = {
            labels: [
                'Red',
                'Orange',
                'Yellow',
                'Green',
                'Blue'
            ],
            datasets: [{
                data: [300, 50, 100, 400, 100],
                backgroundColor: [
                    '#DC3545',
                    '#FD7E14',
                    '#FFC107',
                    '#20C997',
                    '#0D6EFD',
                ],
            }]
        };

        new Chart(incomesPie, {
            type: 'pie',
            data: data,
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

        const expensesPie = document.getElementById('expensesPie');
        new Chart(expensesPie, {
            type: 'pie',
            data: data,
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

}