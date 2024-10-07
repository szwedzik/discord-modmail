# Modmail

## Description

Modmail is a versatile Discord moderation tool designed to empower server moderators with advanced features for efficient community management.

## Installation

1. **Clone the Repository**:

```bash
git clone https://github.com/szwedzik/discord-modmail
```

2. **Install Dependencies**:

```bash
cd discord-modmail
npm install
```

3. **Replace discord-arts library**

- To ensure the bot functions correctly, navigate to the `/lib` directory after installing dependencies.
- Locate the `discord-arts` library within this directory.
- Move `discord-arts` to the `node_modules` directory, replacing all existing files.
- This step is crucial for the proper operation of the bot's /rank command.

4. **Rename Configuration File**:

- Locate `config.example.json` in the project root directory.
- Rename it to `config.json`.
- Edit `config.json` to set up your Discord bot token, database credentials, and other configuration options.

5. **Start the Bot**:

```bash
node .
```

## Features

- **Advanced Ticket System**: Manage user inquiries and reports efficiently with a robust ticketing system.
- **Advanced Discord Logs**: Keep detailed logs of server activities for moderation and reference purposes.
- **Advanced Moderation Commands**: Utilize powerful moderation commands to enforce rules and maintain order in Discord server.

## Usage

- **Ticket System**: User needs to send a DM to FlexMod in order to open a new ticket.
- **Logging**: All logs are enabled by deafult and are logged to several categories such as: Discord Logs, Mod Logs and Personal Logs.
- **Commands**: Utilize various moderation commands such as `/kick`, `/ban`, `/mute`, etc., to manage user behavior according to server rules.

## Customization

Modmail offers flexibility for customization to suit your server's specific needs. Here are some customization options:

- **Commands**: Modify or add new commands in the `commands` directory to extend bot functionality.

## How to Modify Modmail's Strings

All customizable strings used by Modmail can be found in the `/locales/` file. By modifying strings in this file, you can customize the text used by the bot throughout its functionalities.

### Steps to Modify Strings:

1. **Locate the locales folder**:

   - Navigate to the root directory in your Modmail project.
   - Open the `locales` folder.
   - In there, you will find all avliable sub-folders with `subfoldername.js` f.ex giveaway.js file that holds the translation.

2. **Modify Strings**:

   - Inside `subfoldername.js`, you'll find various keys and their corresponding values.
   - Update the values of the keys to customize the text used by Modmail.
   - Ensure to maintain the structure and syntax of the file while making modifications.

3. **Save Changes**:

   - After making the desired modifications, save the modified file.

4. **Restart the Bot**:
   - If Modmail is running, restart the bot to apply the changes.
   - You can restart the bot by stopping it (`Ctrl + C` in the terminal) and then starting it again (`node index.js`).

### Example:

```javascript
// locales/giveaways/giveaway.js
module.exports = {
  join: {
    success: "🎉 You have successfully joined the giveaway!",
    alreadyJoined: "You have already joined the giveaway!",
  },
  btn: {
    participate: "🎉 Participate",
    join: "🎉 Participate ({participants})",
  },
  modal: {
    title: "🎉 New Giveaway!",
    ended: "🎉 Giveaway Ended! [RESULTS] 🎉",
    winnersDesc:
      "🎉 The winners of this giveaway are tagged above! Congratulations! 🎉",
    fields: {
      prize: "Prize",
      giveaway_ends: "Giveaway ends",
      giveaway_ended: "Giveaway ended",
    },
    participants: "Participants: {participants}",
  },
};

```
