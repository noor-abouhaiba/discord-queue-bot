const Discord = require("discord.js");
module.exports.run = async (priority_queue, bot, message, args) => {
    let d = new Date(); // for now
    let hour = d.getHours(); // => 9
    let minutes = d.getMinutes(); // =>  30
    let second = d.getSeconds(); // => 51

    let queueUsers = Array();

    await priority_queue.forEach(user => {
        queueUsers.push(user.user.username);
    });

    console.log("Users in queue: " + queueUsers);
    let display_queue_embed = new Discord.MessageEmbed()
        .setDescription(`Queue`)
        .setColor("#03E4FB")
        .setFooter(`${message.createdAt}`);

    let userIndex = 1;

    console.log(queueUsers.toString());

    let queueUsers1 = Array();
    await queueUsers.forEach(user => {
        queueUsers1.push(`**${userIndex++}: ** ${user}\n`)
    });

    if (queueUsers1 !== undefined && queueUsers1.length !== 0) {
        queueUsers1 = queueUsers1.join(' ');
        display_queue_embed.addField(`Users: `, `${queueUsers1}`);
    }

    return await message.channel.send(display_queue_embed);
};

module.exports.help = {
    name: "display"
};