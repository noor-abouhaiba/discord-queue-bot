const Discord = require("discord.js");

module.exports.run = async (priority_queue, bot, message, args) => {
    let senderHasSuperuser = false;

    if (message.member.hasPermission("ADMINISTRATOR")) {
        senderHasSuperuser = true;
    }
    else {
        message.member.roles.cache.forEach(role => {
            if (role.name === "Superuser") {
                senderHasSuperuser = true;
            }
        });
    }

    if (!senderHasSuperuser) {
        return message.reply("\`you don't have the necessary permissions to perform this action, dumb bitch\`");
    }

    let previousSize = priority_queue.size();
    priority_queue.clear();

    let newSize = priority_queue.size();

    await message.channel.send(` \`Queue successfully cleared. Previous size: ${previousSize}, current size: ${newSize}\``);
    return bot.commands.get("display").run(priority_queue, bot, message, args);
};

module.exports.help = {
    name: "clear"
};