import * as tempusDominus from "@eonasdan/tempus-dominus";

export class Operations {
    constructor() {
        this.init().then();

    }

    async init() {
        new tempusDominus.TempusDominus(document.getElementById('datetimepicker1'));
        new tempusDominus.TempusDominus(document.getElementById('datetimepicker2'));


    }

}