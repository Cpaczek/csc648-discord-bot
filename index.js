require('dotenv').config()
const {Client, Intents} = require('discord.js');
const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});
const JSONdb = require('simple-json-db');
const db = new JSONdb('./storage.json');

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});
client.on('messageCreate', msg => {
    console.log(msg.guild.id)
    console.log(new Date().toLocaleString().split(',')[0],)
    if (!db.has(msg.guild.id)) {
        db.set(msg.guild.id, {
            name: msg.guild.name,
            messages: [
                {
                    date: new Date().toLocaleString().split(',')[0],
                    messageCount: 0
                }
            ]
        })
    }
    //check if there is already a date for today

    if (db.JSON()[msg.guild.id].messages.find(x => x.date === new Date().toLocaleString().split(',')[0])) {
        //if there is, increment the message count
        let x = db.get(msg.guild.id)
        x.messages.find(x => x.date === new Date().toLocaleString().split(',')[0]).messageCount++;
        db.set(msg.guild.id, x)
    } else {
        //if there isn't, add a new date and set the message count to 1
        let x = db.get(msg.guild.id)
        x.messages.push({
            date: new Date().toLocaleString().split(',')[0],
            messageCount: 1
        })
        db.set(msg.guild.id, x)
    }
    console.log(db.JSON())
    console.log(db.JSON()[msg.guild.id].messages)
});

client.login(process.env.BOT_TOKEN);
