const { Client, GatewayIntentBits } = require("discord.js");
const express = require("express");
const https = require("https");

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

  let text = message.content;

  if (message.embeds.length > 0) {
    message.embeds.forEach(embed => {
      if (embed.description) text += " " + embed.description;
      if (embed.fields) {
        embed.fields.forEach(field => {
          text += " " + field.value;
        });
      }
    });
  }

  // Match full URL format
  const urlMatch = text.match(/placeId=(\d+)&gameInstanceId=([\w-]+)/);
  if (urlMatch) {
    latestJob = { placeId: urlMatch[1], jobId: urlMatch[2] };
    return;
  }

  // Match raw UUID format
  const uuidMatch = text.match(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/);
  if (uuidMatch) {
    latestJob = { placeId: "142823291", jobId: uuidMatch[0] };
  }
});

app.get("/job", (req, res) => {
  res.json(latestJob || {});
});

setInterval(() => {
  https.get("https://bot-a1.onrender.com/job", (res) => {
    console.log("Kept alive:", res.statusCode);
  }).on("error", (e) => {
    console.error("Keep alive error:", e);
  });
}, 300000);

app.listen(3000, () => console.log("Bot is running!"));
client.login(process.env.BOT_TOKEN);
