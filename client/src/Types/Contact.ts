export interface MemberContactI {
    email: string;
    telephone?: never;
    accepted: boolean;
}

export interface NonMemberContactI {
    telephone: string;  // Required if it's a non-member
    email?: never;  // Email should not be present if telephone exists
}

export type ContactI = (MemberContactI | NonMemberContactI) & {
    trusted: boolean;
    emergency: boolean;
    favorite: boolean;
};