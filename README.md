# Telegram Error Reporter Bot

A simple Express.js server with Telegram bot integration for reporting errors to a Telegram channel.

## Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Create a Telegram bot:**

   - Message [@BotFather](https://t.me/BotFather) on Telegram
   - Use `/newbot` command and follow instructions
   - Save the bot token

3. **Get Channel ID:**

   - Add your bot to the target channel as an admin
   - Send a message to the channel
   - Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
   - Look for the channel ID in the response (starts with `-100`)

4. **Configure environment:**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your bot token and channel ID.

5. **Run the server:**
   ```bash
   npm start
   # or for development with auto-restart:
   npm run dev
   ```

## Usage

Send POST requests to `/report-error` with JSON body:

```json
{
  "project_name": "My App",
  "error_message": "Database connection failed"
}
```

### Example with curl:

```bash
curl -X POST http://localhost:3000/report-error \
  -H "Content-Type: application/json" \
  -d '{
    "project_name": "My Project",
    "error_message": "Something went wrong!"
  }'
```

### Example with JavaScript:

```javascript
fetch("http://localhost:3000/report-error", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    project_name: "Frontend App",
    error_message: "API request failed with status 500",
  }),
});
```

## Endpoints

- `POST /report-error` - Send error report to Telegram channel
- `GET /health` - Health check endpoint

## Docker Deployment

### Using Docker:

```bash
# Build the image
docker build -t telegram-error-bot .

# Run the container
docker run -d \
  --name telegram-bot \
  -p 3000:3000 \
  -e BOT_TOKEN=your_bot_token \
  -e CHANNEL_ID=your_channel_id \
  telegram-error-bot
```

### Using Docker Compose:

```bash
# Make sure your .env file is configured
docker-compose up -d

# Stop
docker-compose down
```

## Message Format

The bot sends formatted messages to your Telegram channel:

```
🚨 Error Report

📋 Project: My App
❌ Error: Database connection failed

🕒 Time: 2024-01-15T10:30:00.000Z
```
