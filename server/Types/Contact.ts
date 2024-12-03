export interface MemberContactI {
    email: string;  // Required if it's a member
    telephone?: never;  // Telephone should not be present if email exists
}

export interface NonMemberContactI {
    telephone: string;  // Required if it's a non-member
    email?: never;  // Email should not be present if telephone exists
}

export type ContactI = (MemberContactI | NonMemberContactI) & {
    trusted: boolean;  // If the invitation is accepted
    emergency: boolean;  // Emergency contact flag
    favorite: boolean;  // Favorite contact flag
};
