import { Request, Response, RequestHandler } from "express";
import { twilioClient } from "../config/twilioConfig";

// Type definitions for incoming request body
interface NotifyRequestBody {
  contacts: string[];
  message: string;
}

// Controller for notifying contacts
export const notifyContacts: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const { contacts, message }: NotifyRequestBody = req.body;

  if (!contacts || !message) {
    res.status(400).json({ error: "Contacts and message are required." });
    return; // Ensure early return for invalid requests
  }

  try {
    // Validate phone numbers and create SMS promises
    const validContacts = contacts.filter((contact) =>
      /^\+?[1-9]\d{1,14}$/.test(contact)
    );

    if (validContacts.length === 0) {
      res.status(400).json({ error: "No valid phone numbers provided." });
      return;
    }

    const smsPromises = validContacts.map((phone) =>
      twilioClient.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER as string, // Twilio phone number
        to: phone,
      })
    );

    // Wait for all SMS promises to resolve
    const smsResults = await Promise.allSettled(smsPromises);

    // Log results for debugging
    smsResults.forEach((result, index) => {
      if (result.status === "fulfilled") {
        console.log(`SMS sent successfully to ${validContacts[index]}`);
      } else {
        console.error(
          `Failed to send SMS to ${validContacts[index]}:`,
          result.reason
        );
      }
    });

    const failedContacts = smsResults
      .map((result, index) => (result.status === "rejected" ? validContacts[index] : null))
      .filter(Boolean);

    res.status(200).json({
      success: true,
      message: "SMS notifications processed.",
      failedContacts,
    });
  } catch (error) {
    console.error("Error sending SMS notifications:", error);
    res.status(500).json({ error: "Failed to send SMS notifications." });
  }
};