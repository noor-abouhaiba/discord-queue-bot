const Discord = require("discord.js");

module.exports.run = async (priority_queue, bot, message, args) => {
    let sender = message.member;
    let existsInQueue = false;

    await priority_queue.forEach(user => {
        if (user.user.id === sender.user.id) {
            existsInQueue = true;
        }
    });

    if (existsInQueue) {
        return await message.reply(` \`you are already in the queue, dumb bitch\``);
    }

    await priority_queue.enqueue(sender);

    console.log("adding to queue: " + sender.user.username);
    console.log("queue size: " + priority_queue.size());
    console.log("peeking queue: " + priority_queue.peek().user.username);

    return await bot.commands.get("display").run(priority_queue, bot, message, args);
};

module.exports.help = {
    name: "join"
};