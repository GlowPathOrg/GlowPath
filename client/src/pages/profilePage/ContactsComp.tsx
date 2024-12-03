import React, { useState } from "react";
import '../../styles/ContactsComp.css';

// Types for Member and Non-Member Contacts
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

const ContactsComponent: React.FC = () => {
    // Initial mock data for contacts
    const [contacts, setContacts] = useState<ContactI[]>([
        { email: "john.doe@example.com", trusted: true, emergency: false, favorite: true },
        { email: "jane.smith@example.com", trusted: false, emergency: true, favorite: false },
        { telephone: "+1234567890", trusted: true, emergency: true, favorite: false },
        { telephone: "+1987654321", trusted: false, emergency: false, favorite: true },
    ]);

    const [newContact, setNewContact] = useState<string>("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewContact(e.target.value);
    };

    const handleAddContact = () => {
        // Check if the new contact is an email or telephone
        const newContactObj: ContactI = newContact.includes("@")
            ? {
                email: newContact,
                trusted: false,
                emergency: false,
                favorite: false,
            }
            : {
                telephone: newContact,
                trusted: false,
                emergency: false,
                favorite: false,
            };

        // Add new contact to the state
        setContacts([...contacts, newContactObj]);
        setNewContact(""); // Clear input after adding
    };

    // Sorting contacts (favorites first, then non-favorites)
    const sortedContacts = contacts.sort((a, b) => {
        if (a.favorite === b.favorite) {
            return 0;
        }
        return a.favorite ? -1 : 1;
    });

    // Separate pending and accepted invitations
    const pendingContacts = sortedContacts.filter(contact => !contact.trusted);
    const acceptedContacts = sortedContacts.filter(contact => contact.trusted);

    // Function to accept invitation
    const acceptInvitation = (index: number) => {
        const updatedContacts = [...contacts];
        updatedContacts[index].trusted = true; // Mark the contact as trusted
        setContacts(updatedContacts); // Update the state
    };

    return (
        <div className="contacts-comp">
            <h2>Contacts</h2>

            {/* Add new contact */}
            <div className="add-contact">
                <input
                    type="text"
                    placeholder="Enter email or phone"
                    value={newContact}
                    onChange={handleInputChange}
                />
                <button onClick={handleAddContact}>Add Contact</button>
            </div>

            {/* Pending Invitations Section */}
            {pendingContacts.length > 0 && (
                <div className="pending-invitations">
                    <h3>Pending Invitations</h3>
                    <ul className="contacts-list">
                        {pendingContacts.map((contact, index) => (
                            <li key={index} className="contact-item">
                                <div className="contact-info">
                                    {contact.email ? (
                                        <p>{contact.email}</p> // Display email for members
                                    ) : (
                                        <p>{contact.telephone}</p> // Display telephone for non-members
                                    )}
                                    {/* Disable the favorite option for pending invitations */}
                                    {contact.favorite && <span className="favorite-badge">❤️</span>}
                                </div>
                                <div className="contact-status">
                                    <span className="pending-invitation">Pending Invitation</span>
                                    {/* Accept button for pending invitations */}
                                    <button onClick={() => acceptInvitation(index)}>Accept Invitation</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Accepted Invitations Section */}
            {acceptedContacts.length > 0 && (
                <div className="accepted-invitations">
                    <h3>Accepted Invitations</h3>
                    <ul className="contacts-list">
                        {acceptedContacts.map((contact, index) => (
                            <li key={index} className="contact-item">
                                <div className="contact-info">
                                    {contact.email ? (
                                        <p>{contact.email}</p> // Display email for members
                                    ) : (
                                        <p>{contact.telephone}</p> // Display telephone for non-members
                                    )}
                                    {contact.favorite && <span className="favorite-badge">❤️</span>}
                                </div>
                                <div className="contact-status">
                                    <span className="trusted">Invitation Accepted</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ContactsComponent;
