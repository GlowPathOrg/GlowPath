// src/services/smsService.ts
export const sendSmsNotifications = async (contacts: string[], message: string): Promise<string> => {
    try {
      const response = await fetch("/notify-contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contacts, message }),
      });

      if (!response.ok) {
        throw new Error("Failed to send SMS notifications");
      }

      return response.json(); // Parse and return the response
    } catch (error) {
      console.error("Error in sending SMS notifications:", error);
      throw error; // Re-throw for further handling
    }
  };