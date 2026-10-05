"use server";

export async function sendMessage(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    if (!name || !email || !message) {
      return { success: false, error: "All fields are required." };
    }

    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
      console.error("DISCORD_WEBHOOK_URL is not set.");
      return { success: false, error: "Server configuration error." };
    }

    const content = `New Portfolio Message!\n**Name:** ${name}\n**Email:** ${email}\n**Message:** ${message}`;

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      console.error("Failed to send webhook", await response.text());
      return { success: false, error: "Failed to send message. Please try again later." };
    }

    return { success: true };
  } catch (error) {
    console.error("Error in sendMessage action:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}
