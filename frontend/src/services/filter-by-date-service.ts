import * as tempusDominus from "@eonasdan/tempus-dominus";
import {TempusDominus} from "@eonasdan/tempus-dominus";
import {GetOperationsParamsType} from "../types/get-operations-params.type";

export class FilterByDateService {
    private dateFilterFrom: string | null;
    private dateFilterTo: string | null;
    readonly dateFilterFromElement: HTMLElement | null;
    readonly dateFilterToElement: HTMLElement | null;
    public filterParamElements: NodeListOf<HTMLElement> | null;
    private activeFilter: HTMLElement | null;
    private intervalFilter: HTMLElement | null;

    private dateFilterFromTempusElement: TempusDominus | undefined;
    private dateFilterToTempusElement: TempusDominus | undefined;

    constructor() {
        this.dateFilterFrom = null;
        this.dateFilterTo = null;
        this.dateFilterFromElement = document.getElementById('datetimepickerMin');
        this.dateFilterToElement = document.getElementById('datetimepickerMax');
        this.activateDateElements();

        this.filterParamElements = document.querySelectorAll('.filter-param');
        this.activeFilter = document.getElementById('today');
        this.intervalFilter = document.getElementById('interval');

        this.filterParamElements.forEach((filterBtn: HTMLElement): void => {
            filterBtn.addEventListener('click', async (): Promise<void> => {
                await this.activateFilterElements(filterBtn);
            });
        });
    }

    public async activateFilterElements(item: HTMLElement): Promise<GetOperationsParamsType[] | null> {
        this.activeFilter?.classList.remove('active');
        this.activeFilter = item;
        item.classList.add('active');

        let params: GetOperationsParamsType[] = [
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
                return null;
            }
        } else {
            this.dateFilterFrom = null;
            this.dateFilterTo = null;
            if (this.dateFilterFromElement) {
                this.dateFilterFromElement.innerText = 'Дата';
            }
            if (this.dateFilterToElement) {
                this.dateFilterToElement.innerText = 'Дата';
            }
        }
        return params;
    };

    private activateDateElements(): void {
        this.dateFilterFromTempusElement = new tempusDominus.TempusDominus(document.getElementById('datetimepickerMin') as HTMLElement);
        this.dateFilterToTempusElement = new tempusDominus.TempusDominus(document.getElementById('datetimepickerMax') as HTMLElement);
        this.dateFilterFromTempusElement.subscribe(tempusDominus.Namespace.events.change, (): void => {
            if (this.dateFilterFromTempusElement) {
                this.dateFilterFrom = this.dateFilterFromTempusElement.viewDate.format('yyyy-MM-dd');
            }
            if (this.dateFilterFromElement && this.dateFilterFrom) {
                this.dateFilterFromElement.innerText = this.dateFilterFrom;
            }
            this.intervalFilter?.click();
        });
        this.dateFilterToTempusElement.subscribe(tempusDominus.Namespace.events.change, () => {
            if (this.dateFilterToTempusElement) {
                this.dateFilterTo = this.dateFilterToTempusElement.viewDate.format('yyyy-MM-dd');
            }
            if (this.dateFilterToElement && this.dateFilterTo) {
                this.dateFilterToElement.innerText = this.dateFilterTo;
            }
            this.intervalFilter?.click();
        });
    };
}