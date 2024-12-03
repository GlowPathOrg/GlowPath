export interface ActionI {

    action: string;
    duration: number;
    length: number;
    instruction: string;
    offset: number;

}

export interface InstructionsI{
    _id: string;
    actions: ActionI[];
    duration: number;
    length: number;
    instruction: string;
    offset: number;
    direction?: string;
    severity?: string;
}


export interface SummaryI {
    _id?: string;
    duration: number;
    length: number;
    baseDuration?: number;
}


export interface RouteI {
    _id?: string;
    polyline: [[]];
    instructions: InstructionsI[];
    summary: SummaryI;
}


export interface RouteRequestI {
    origin: string | number[],
    destination: string | number[],
    transportMode?: "pedestrian" | "publicTransport" | "bicycle" | "car" | null,
    return?: "polyline,summary,instructions,actions",
}