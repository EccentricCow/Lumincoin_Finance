export type FormFieldType = {
    name: string,
    id: string,
    element: HTMLInputElement | null,
    regexp: RegExp | null,
    isValid: boolean,
}