const Discord = require("discord.js");
const fetch = require("node-fetch");
const ms = require("ms");

module.exports = class Client {
  /**
   * Initializes a new `radar`
   * @param {Discord.Client} client - Your DiscordJS Client.
   * @param {String} token - The token found from your user page on the Radar Bot Directory.
   */
  constructor(client, token) {
    this.client = client;
    this.token = token;
    this.fetch = fetch;

    if (!(this.client instanceof Discord.Client))
      throw new Error("The client option needs to be a Discord.js Client!");
  }

  /**
   * Posts server stats to the API.
   * Requires the `server count`, `shard count` will be set to 1 if not provided.
   * Can autopost to the API if the `autopost` option is true.
   * The `autopost` option is false by default.
   * @param {Number} serverCount - The amount of servers your bot is in.
   * @param {Number} shardCount - The amount of shards your bot has.
   * @param {Boolean} autopost - Whether to autopost stats every 2 minutes.
   * @returns A Promise either containing the status code (if it's not 200 OK), or a success message.
   */
  stats(serverCount, shardCount = 1, autopost = false) {
    if (!serverCount) throw new Error("The server count is required!");

    if (autopost) {
      var response = new Promise(async (resolve, reject) => {
        var req = await this.fetch.default(
          `https://radarbotdirectory.xyz/api/bot/${this.client.user.id}/stats`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: this.token,
            },
            body: JSON.stringify({
              guilds: serverCount,
              shards: shardCount,
            }),
          }
        );
        var data = await req.json();
        if (req.status != 200) reject(data);
        else resolve(data);
      });
      setInterval(() => {
        return response;
      }, ms("2m"));
    } else {
      return new Promise(async (resolve, reject) => {
        var req = await this.fetch.default(
          `https://radarbotdirectory.xyz/api/bot/${this.client.user.id}/stats`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: this.token,
            },
            body: JSON.stringify({
              guilds: serverCount,
              shards: shardCount,
            }),
          }
        );
        var data = await req.json();
        if (req.status != 200) reject(data);
        resolve(data);
      });
    }
  }

  /**
   * Fetches your bot info from the API.
   */
  botInfo() {
    return new Promise(async (resolve, reject) => {
      var req = await this.fetch.default(
        `https://radarbotdirectory.xyz/api/bot/${this.client.user.id}`,
        {
          method: "GET",
        }
      );
      if (req.status != 200)
        return reject(`[RadarBots.JS] - ${req.status}: ${req.statusText}`);
      var data = await req.json();
      return resolve(data);
    });
  }

  /**
   * Fetches your bot widget from the API.
   */
  botWidget() {
    return new Promise(async (resolve, reject) => {
      var req = await this.fetch.default(
        `https://radarbotdirectory.xyz/api/bot/${this.client.user.id}/widget`,
        {
          method: "GET",
        }
      );
      if (req.status != 200)
        return reject(`[RadarBots.JS] - ${req.status}: ${req.statusText}`);
      var buffer = Buffer.from(await req.arrayBuffer());
      return resolve(buffer);
    });
  }

  /**
   * Fetches the Unix Epoch Timestamp of the last time the specified user voted for your bot.
   * @param {Discord.Snowflake} userID - The ID of the user to look up.
   */
  lastVoted(userID) {
    if (!userID) throw new Error("The user ID is required!");
    return new Promise(async (resolve, reject) => {
      var req = await this.fetch.default(
        `https://radarbotdirectory.xyz/api/lastvoted/${userID}/${this.client.user.id}`,
        {
          method: "GET",
        }
      );
      if (req.status != 200)
        return reject(`[RadarBots.JS] - ${req.status}: ${req.statusText}`);
      var data = await req.json();
      return resolve(data);
    });
  }
};
