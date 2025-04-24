import * as tempusDominus from "@eonasdan/tempus-dominus";

export class FilterByDateService {
    constructor() {
        this.dateFilterFrom = null;
        this.dateFilterTo = null;
        this.dateFilterFromElement = document.getElementById('datetimepickerMin');
        this.dateFilterToElement = document.getElementById('datetimepickerMax');
        this.activateDateElements();

        this.filterParamElements = document.querySelectorAll('.filter-param');
        this.activeFilter = document.getElementById('today');
        this.intervalFilter = document.getElementById('interval');

        this.filterParamElements.forEach(filterBtn => {
            filterBtn.addEventListener('click', async (e) => {
                await this.activateFilterElements(filterBtn);
            });
        });
    }

    async activateFilterElements(item) {
        this.activeFilter.classList.remove('active');
        this.activeFilter = item;
        item.classList.add('active');

        let params = [
            {
                nameParam: 'period',
                valueParam: item.id,
            },
        ];

        if (item.id === 'interval') {
            if (this.dateFilterFrom && this.dateFilterTo) {
                params.push(
                    {
                        nameParam: 'dateFrom',
                        valueParam: this.dateFilterFrom,
                    },
                    {
                        nameParam: 'dateTo',
                        valueParam: this.dateFilterTo,
                    },
                );
            } else {
                return false;
            }
        } else {
            this.dateFilterFrom = null;
            this.dateFilterTo = null;
            this.dateFilterFromElement.innerText = 'Дата';
            this.dateFilterToElement.innerText = 'Дата';
        }
        return params;
    };

    activateDateElements() {
        this.dateFilterFromTempusElement = new tempusDominus.TempusDominus(document.getElementById('datetimepickerMin'));
        this.dateFilterToTempusElement = new tempusDominus.TempusDominus(document.getElementById('datetimepickerMax'));
        this.dateFilterFromTempusElement.subscribe(tempusDominus.Namespace.events.change, (e) => {
            this.dateFilterFrom = this.dateFilterFromTempusElement.viewDate.format('yyyy-MM-dd');
            this.dateFilterFromElement.innerText = this.dateFilterFrom;
            this.intervalFilter.click();
        });
        this.dateFilterToTempusElement.subscribe(tempusDominus.Namespace.events.change, (e) => {
            this.dateFilterTo = this.dateFilterToTempusElement.viewDate.format('yyyy-MM-dd');
            this.dateFilterToElement.innerText = this.dateFilterTo;
            this.intervalFilter.click();
        });
    };
}