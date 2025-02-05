export interface InstructionsI {
    _id: string;
    actions: string[];
    duration: number;
    length: number;
    instruction: string;
    offset: number;
    direction?: string;
    severity?: string;
}


export interface SummaryI {
    _id?: string;
    duration?: number;
    length?: number;
    baseDuration?: number;
}


export interface RouteI {
    _id?: string;
    polyline: [[]];
    instructions: InstructionsI[];
    summary: SummaryI;
}


export interface RouteRequestI {
    origin: string | number[]
    destination: string | number[] | null, // Destination coordinates as [latitude, longitude]
    transportMode?: 'pedestrian' | 'publicTransport' | 'bicycle' | 'car' | null,
    return?: 'polyline,summary,instructions,actions',
}