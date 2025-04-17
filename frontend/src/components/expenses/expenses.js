export class Expenses {
    constructor() {
        document.getElementById('add-expenses-element').addEventListener('click', (e) => {
            window.location.href = '#/expenses/create';
        })
    }


}