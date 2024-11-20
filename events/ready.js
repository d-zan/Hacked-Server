require("dotenv").config();
const chalk = require("chalk");
module.exports = {
  name: "ready",
  async execute(client) {

    console.log("Login " + chalk.green.bold(`${client.user.tag}`));
    //ظconsole.log("Login " + chalk.green.bold(`${client.user.tag}`));
    console.log(
      chalk.blue.underline(
        `https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=268436496&scope=bot`
      )
    );
  },
};
