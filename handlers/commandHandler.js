async function loadCommands(client) {
  const { fileLoader } = require("../Functions/fileloader");
  const ascii = require("ascii-table");
  const table = new ascii().setHeading("Command", "Status");

  await client.commands.clear();
  await client.subCommands.clear();

  let commandsArray = [];
  const Files = await fileLoader("Commands");

  Files.forEach((file) => {
    const command = require(file);

    if (command.subCommand) {
      client.subCommands.set(command.subCommand, command);
      console.log(`SubCommand ${command.subCommand} loaded`);
    }

    if (!command.data) {
      console.error(`Command file '${file}' is missing the 'data' property.`);
      return;
    }

    client.commands.set(command.data.name, command);
    commandsArray.push(command.data.toJSON());
    table.addRow(command.data.name, "✅");
  });

  client.application.commands.set(commandsArray);

  return console.log(table.toString(), "\nCommands Loaded");
}

module.exports = { loadCommands };
