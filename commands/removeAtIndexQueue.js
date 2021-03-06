const Discord = require("discord.js");
const buckets = require('buckets-js');

function compare(user1, user2) {
    let user1HasSuperuser = false;
    let user2HasSuperuser = false;
    // Compare 2 member objects
    user1.roles.cache.forEach(role => {if(role.name === "Superuser") user1HasSuperuser = true});
    user2.roles.cache.forEach(role => {if(role.name === "Superuser") user2HasSuperuser = true});

    console.log("user1 (" + user1.user.username + ") " + user1HasSuperuser);
    console.log("user2 (" + user2.user.username + ") " + user2HasSuperuser);
    if (!user1HasSuperuser && user2HasSuperuser) {
        return -1;
    } if (user1HasSuperuser && !user2HasSuperuser) {
        return 1;
    }
    // a must be equal to b
    return 0;
}
let newPQ = new buckets.PriorityQueue(compare);

module.exports.run = async (priority_queue, bot, message, args) => {

    let senderHasSuperuser = false;
    // Compare 2 member objects
    if (message.member.hasPermission("ADMINISTRATOR")) {
        senderHasSuperuser = true;
    }
    else {
        message.member.roles.cache.forEach(role => {
            if (role.name === "Superuser") {
                senderHasSuperuser = true
            }
        });
    }

    if (!senderHasSuperuser) {
        return message.reply("\`you don't have the necessary permissions to perform this action, dumb bitch\`");
    }

    let userIndex = 1;
    let indexToRemoveAt = args[1];

    if (!indexToRemoveAt) {
        return message.reply("\`which index? dumb bitch\`");
    }
    else if (indexToRemoveAt > priority_queue.size()) {
        return message.reply(`\`The current queue size is less than the specified index, dumb bitch\``);
    }
    else if (isNaN(indexToRemoveAt)) {
        return message.reply(`\`The given index is not a valid number, dumb bitch\``);
    }

    console.log(`${userIndex} : ${indexToRemoveAt}`);

    priority_queue.forEach(user => {
        console.log(`current index ${userIndex}`);
        // Removes user from queue, checks equivalence to some constant (name/id)
        if (userIndex.toString() !== indexToRemoveAt) {
            newPQ.enqueue(user);
        }
        else {
            console.log(`removing user: ${user.user.username}`);
        }
        userIndex++;
    });

    priority_queue.clear();
    newPQ.forEach(user => {
        priority_queue.enqueue(user);
    });

    priority_queue.forEach(user => {
        console.log(`currentUser ${user.user.username}`)
    });

    return bot.commands.get("display").run(priority_queue, bot, message, args);
};

module.exports.help = {
    name: "remove"
};