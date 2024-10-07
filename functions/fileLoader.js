const { glob } = require("glob");

async function fileLoader(path) {
  const Files = await glob(
    // eslint-disable-next-line no-undef
    `${process.cwd().replace(/\\/g, "/")}/${path}/**/*.js`,
  );
  Files.forEach((file) => delete require.cache[require.resolve(file)]);
  return Files;
}

module.exports = { fileLoader };
