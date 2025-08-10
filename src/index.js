const express = require("express");
const { Telegraf } = require("telegraf");
require("@dotenvx/dotenvx").config();

const app = express();
const bot = new Telegraf(process.env.BOT_TOKEN);

app.use(express.json());

// Environment variables validation
if (!process.env.BOT_TOKEN) {
  console.error("BOT_TOKEN is required");
  process.exit(1);
}

if (!process.env.CHANNEL_ID) {
  console.error("CHANNEL_ID is required");
  process.exit(1);
}

// POST endpoint to receive error reports
app.post("/report-error", async (req, res) => {
  try {
    const { project_name, error_message } = req.body;

    // Validate required fields
    if (!project_name || !error_message) {
      return res.status(400).json({
        error: "Both project_name and error_message are required",
      });
    }

    // Format the message
    const message =
      `🚨 *Error Report*\n\n` +
      `📋 *Project:* ${project_name}\n` +
      `❌ *Error:* ${error_message}\n\n` +
      `🕒 *Time:* ${new Date().toISOString()}`;

    // Send message to Telegram channel
    await bot.telegram.sendMessage(process.env.CHANNEL_ID, message, {
      parse_mode: "Markdown",
    });

    res.status(200).json({
      success: true,
      message: "Error report sent successfully",
    });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({
      error: "Failed to send error report",
      details: error.message,
    });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("Shutting down gracefully...");
  process.exit(0);
});

module.exports = app;
