const { Client } = require("discord.js");
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const client = new Client({
  intents: 32767,
});
require("dotenv/config");
const express = require("express");
const app = express();
app.get("/", (req, res) => {
  res.send("Discord : dz0.");
});
app.listen(3000, () => {
  console.log(chalk.blue.bold("Express is ready."));
});
const eventsFilesPath = path.join(__dirname, "events");
const eventsFiles = fs
  .readdirSync(eventsFilesPath)
  .filter((file) => file.endsWith(".js"));
for (const file of eventsFiles) {
  const files = path.join(eventsFilesPath, file);
  const event = require(files);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}
console.log(chalk.green(` ##  ##     ##     #####   ###  ##  #######  ######             #####   #######  ######    ##  ##  #######  ######   
 ##  ##    ####   ##   ##   ## ##    ##  ##   ##  ##           ##   ##   ##  ##   ##  ##   ##  ##   ##  ##   ##  ##  
 ##  ##   ##  ##  ##        ####     ##       ##  ##           ##        ##       ##  ##   ##  ##   ##       ##  ##  
 ######   ######  ##        ###      ####     ##  ##   ######   #####    ####     #####    ##  ##   ####     #####   
 ##  ##   ##  ##  ##        ####     ##       ##  ##                ##   ##       ####     ##  ##   ##       ####    
 ##  ##   ##  ##  ##   ##   ## ##    ##  ##   ##  ##           ##   ##   ##  ##   ## ##     ####    ##  ##   ## ##   
 ##  ##   ##  ##   #####   ###  ##  #######  ######             #####   #######  ###  ##     ##    #######  ###  ##  
                                                                                                                     
`))
client.login(process.env.TOKEN).catch((error) => console.error(error));
/// ##  ##     ##     #####   ###  ##  #######  ######             #####   #######  ######    ##  ##  #######  ######   
/// ##  ##    ####   ##   ##   ## ##    ##  ##   ##  ##           ##   ##   ##  ##   ##  ##   ##  ##   ##  ##   ##  ##  
/// ##  ##   ##  ##  ##        ####     ##       ##  ##           ##        ##       ##  ##   ##  ##   ##       ##  ##  
/// ######   ######  ##        ###      ####     ##  ##   ######   #####    ####     #####    ##  ##   ####     #####   
/// ##  ##   ##  ##  ##        ####     ##       ##  ##                ##   ##       ####     ##  ##   ##       ####    
 ///##  ##   ##  ##  ##   ##   ## ##    ##  ##   ##  ##           ##   ##   ##  ##   ## ##     ####    ##  ##   ## ##   
/// ##  ##   ##  ##   #####   ###  ##  #######  ######             #####   #######  ###  ##     ##    #######  ###  ##  
                                                                                                                    