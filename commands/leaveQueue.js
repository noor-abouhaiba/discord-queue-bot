const Discord = require("discord.js");
const buckets = require('buckets-js');

function compare(user1, user2) {
    let user1HasSuperuser = false;
    let user2HasSuperuser = false;
    // Compare 2 member objects
    user1.roles.cache.forEach(role => {if(role.name === "Superuser") user1HasSuperuser = true});
    user2.roles.cache.forEach(role => {if(role.name === "Superuser") user2HasSuperuser = true});

    if (user1.hasPermission("ADMINISTRATOR")) user1HasSuperuser = true;
    if (user2.hasPermission("ADMINISTRATOR")) user2HasSuperuser = true;

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
    console.log(message.author);

    await priority_queue.forEach(user => {
        // Removes user from queue, checks equivalence to some constant (name/id)
        if (user.user.id !== message.author.id) {
            newPQ.enqueue(user);
        }
        else {
            console.log(`removing user: ${user.user.username}`);
        }
    });

    await priority_queue.clear();
    await newPQ.forEach(user => {
        priority_queue.enqueue(user);
    });

    priority_queue.forEach(user => {
        console.log(`currentUser ${user.user.username}`)
    });

    return await bot.commands.get("display").run(priority_queue, bot, message, args);
};

module.exports.help = {
    name: "leave"
};