const botconfig = require("./config/botConfig.json");
// const tokenconfig = require("./config/token.json");
const Discord = require("discord.js");

const bot = new Discord.Client();
bot.commands = new Discord.Collection();
const fs = require("fs");
const path = require("path");
const buckets = require('buckets-js');

// let superuserRole = message.guild.roles.find("name", "rolename");
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
var priority_queue = new buckets.PriorityQueue(compare);

const commands_path = path.join(__dirname, "commands");

console.log("Commands filepath: \t" + commands_path);

// Load commands directory .js files
fs.readdir(commands_path, (err, files) => {
    if (err)
        console.log(err);

    let js_file = files.filter(f => f.split(".").pop() === "js");
    console.log(js_file);
    if (js_file.length <= 0) {
        console.log("Could not locate commands directory.");
        return;
    }
    let props;
    js_file.forEach((f, i) => {
        props = require(`./commands/${f}`);
        console.log(`${f} loaded.`);
        bot.commands.set(props.help.name, props);
    });
});

bot.on("ready", async () => {
    console.log(`${bot.user.username} is online`);
    // bot.user.setActivity("with...");

    //TODO:
    //test-server guild id: 696909516976947201
    // const guild = bot.guilds.cache.first();
    const guild = bot.guilds.cache.get("696909516976947201");
});

bot.on('message', async message => {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;

    let prefix = "q!";
    let messageBuffer = message.content.split(/ +/);

    // message.member.roles.cache.forEach(role => console.log(role.name, role.id));
    // priority_queue.enqueue(message.member);
    // console.log("peeking queue: " + priority_queue.peek().user.username);
    if (messageBuffer[0] !== prefix) {
        return;
    }
    let command = messageBuffer[1];
    let args = messageBuffer.slice(1);

    let command_file = bot.commands.get(command);

    if (command_file) {
        command_file.run(priority_queue, bot, message, args);
    }
});

bot.login(process.env.TOKEN);

/* Priority Queue implementation:
 *
 * only superuser role has priority to push/pop from queue, also clear queue (destroy)
 * all users can display and enter queue
 * allow users to leave queue on their own
 * allow superuser to remove specific users from the queue (does not require the user to be at the front of the queue)
 * allow superuser to percolate users from their current queue position to the front
 * allow superuser to remove specific indexed user in the queue
 * q! pull 4 - allow superuser to pull multiple users simultaneously from the queue (integer value is optional,
 *      if not specified pull only a single user
 * when a user is popped from the queue ping them with a 5 minute timer notification message
 * show currently playing players in a set, be able to track how many runs (by command) they have completed, using an accumulator
 *      be able to remove players from this set, add players to this set by use of reaction to notification message (must check
 *      that the user reacting is the tagged user)
 */