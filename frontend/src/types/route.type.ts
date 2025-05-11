export type RouteType = {
    route: string,
    title?: string,
    useLayout?: string,
    template?: string,
    load(): void,
}