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
    else if (priority_queue.isEmpty()) {
        return message.reply("`The queue is empty, dumb bitch`");
    }

    let numToDraft = args[1];
    if (numToDraft === undefined) {
        let frontUser = priority_queue.peek();
        priority_queue.dequeue();

        await message.channel.send(`${frontUser} \`it's time, be ready and join voice within 5 minutes. Don't throw :)\``);
    }
    else {
        numToDraft = parseInt(numToDraft);
        for(let i = 0; i < numToDraft && !priority_queue.isEmpty(); i++) {
            let frontUser = priority_queue.peek();
            priority_queue.dequeue();

            await message.channel.send(`${frontUser} \`it's time, be ready and join voice within 5 minutes. Don't throw :)\``);
        }
    }
    return bot.commands.get("display").run(priority_queue, bot, message, args);
};

module.exports.help = {
    name: "draft"
};