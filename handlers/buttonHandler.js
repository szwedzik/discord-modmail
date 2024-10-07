async function loadButtons(client) {
  const { fileLoader } = require("../Functions/fileloader");
  const ascii = require("ascii-table");
  const table = new ascii("Buttons List");

  await client.buttons.clear();

  const Files = await fileLoader("Buttons");

  Files.forEach((file) => {
    const button = require(file);
    if (!button.id) return;
    client.buttons.set(button.id, button);
    table.setHeading(`Button ID`, `Status`);
    table.addRow(`${button.id}`, "✅");
  });

  return console.log(table.toString(), "\nButtons Loaded");
}

module.exports = { loadButtons };
