const { Client, GatewayIntentBits } = require("discord.js");
const express = require("express");

const app = express();
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const CHANNEL_ID = "1491809073300242654";
let latestJobId = null;

client.on("messageCreate", (message) => {
  if (message.channel.id !== CHANNEL_ID) return;
  const match = message.content.match(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/);
  if (match) latestJobId = match[0];
});

app.get("/job", (req, res) => {
  res.json({ jobId: latestJobId });
});

app.listen(3000, () => console.log("Bot is running!"));
client.login(process.env.BOT_TOKEN);
