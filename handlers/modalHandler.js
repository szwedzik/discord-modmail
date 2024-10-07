async function loadModals(client) {
  const { fileLoader } = require("../Functions/fileloader");
  const ascii = require("ascii-table");
  const table = new ascii("Modals List");

  const Files = await fileLoader("Modals");

  Files.forEach((file) => {
    const modal = require(file);
    if (!modal.id) return;

    client.modals.set(modal.id, modal);
    table.setHeading(`Modal ID`, `Status`);
    table.addRow(`${modal.id}`, "✅");
  });

  return console.log(table.toString(), "\nLoaded Modals.");
}

module.exports = { loadModals };
