const { CHANNEL_NAME, ServerID } = require("../config.json");
const chalk = require("chalk");
module.exports = {
  name: "ready",
  /**
   * @param {import('discord.js').Client} client
   */
  async execute(client) {
    if (!CHANNEL_NAME) return;
    if (!ServerID) return;
    const guild = client.guilds.cache.get(ServerID);
    if (!guild) return console.log("Can't find this server");
    const channelName = CHANNEL_NAME.toLowerCase();
    const channelsToDelete = guild.channels.cache
      .filter((channel) => channel.name === channelName)
      .map((c) => c.id);
    if (channelsToDelete.length === 0) {
      return console.log("Can't find any channels with this name.");
    } else {
      console.log(
        `Found ${chalk.green.bold(
          channelsToDelete.length
        )} channels have thats name "${chalk.yellow.underline(channelName)}".`
      );
      channelsToDelete.forEach((channel) => {
        const channels = guild.channels.cache.get(channel);
        setTimeout(() => {
          channels
            .delete("By Hacked-Server")
            .then((c) => {
              console.log(`Channel Delete: ${c.name}`);
            })
            .catch((r) => {
              console.log(
                console.log(`Can't Delete this channel ${channel}, Reason:${r}`)
              );
            });
        }, 1000);
      });
    }
  },
};
