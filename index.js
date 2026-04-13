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
let latestJob = null;

client.on("messageCreate", (message) => {
  if (message.channel.id !== CHANNEL_ID) return;
  const match = message.content.match(/placeId=(\d+)&gameInstanceId=([\w-]+)/);
  if (match) {
    latestJob = {
      placeId: match[1],
      jobId: match[2]
    };
  }
});

app.get("/job", (req, res) => {
  res.json(latestJob || {});
});

app.listen(3000, () => console.log("Bot is running!"));
client.login(process.env.BOT_TOKEN);
