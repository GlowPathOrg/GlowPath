export interface NavigationI {
    action: string;
    duration: number;
    length: number;
    instruction: string;
    offset: number;
    direction?: string;
    severity?: string;
}


export interface SummaryI {
    duration: number;
    length: number;
    baseDuration: number;
}


export interface RouteI {
    polyline: string;
    instructions: NavigationI[];
    summary: SummaryI;
    password?: string;
}
