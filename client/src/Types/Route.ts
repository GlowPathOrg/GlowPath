export interface InstructionsI {
    _id: string;
    action: string;
    duration: number;
    length: number;
    instruction: string;
    offset: number;
    direction?: string;
    severity?: string;
}


export interface SummaryI {
    _id: string;
    duration: number;
    length: number;
    baseDuration: number;
}


export interface RouteI {
    _id: string;
    polyline: string;
    instructions: InstructionsI[];
    summary: SummaryI;
}
