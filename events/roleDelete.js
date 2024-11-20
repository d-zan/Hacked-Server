const chalk = require("chalk");
const { ROLE_NAME, ServerID } = require("../config.json");
module.exports = {
  name: "ready",
  /**
   * @param {import("discord.js").Client} client
   */
  async execute(client) {
    if (!ROLE_NAME) return;
    if (!ServerID) return;
    const guild = client.guilds.cache.get(ServerID);
    if (!guild) return console.error("Can't find this server.");
    const rolesToDelete = guild.roles.cache
      .filter((role) => role.name === ROLE_NAME)
      .map((role) => role.id);

    if (rolesToDelete.length === 0) {
      console.log(
        `No roles with the name "${chalk.yellow.underline(ROLE_NAME)}"`
      );
    } else {
      console.log(
        `Found ${chalk.green.bold(
          rolesToDelete.length
        )} roles with the name "${chalk.yellow.underline(ROLE_NAME)}".`
      );
      rolesToDelete.forEach((role) => {
        const ROLE = guild.roles.cache.get(role);
        setTimeout(() => {
          ROLE.delete()
            .then((role) => {
              console.log(`Role Delete: ${role.name}`);
            })
            .catch((r) => {
              console.log(console.log(`Can't Delete this role ${role}, Reason:${r}`));
            });
        }, 1000);
      });
    }
  },
};