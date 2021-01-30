const {Client,Intents} = require('discord.js');
const express = require('express');
const cors = require('cors');
const {prefix,token,me,server} = require('./config/config.json');
const port = 5000;

const app = express();
app.use(cors(),express.json(),express.urlencoded({extended:true}));
let intents = new Intents(Intents.NON_PRIVILEGED);
intents.add('GUILD_MEMBERS');
const client = new Client({ws:{intents:intents}});
let guild;

app.post('/addRole', async (req,res) => {
    const member = await guild.members.fetch(req.body.user).catch(err => res.status(500).send(err));
    const role = await guild.roles.fetch(req.body.role).catch(err => res.status(500).send(err));
    member.roles.add(role)
    .then(resp => res.send("Successfully added role"))
    .catch(err => res.status(500).send(err));
    console.log(member.user.tag,role.name);
})

app.get('/allUsers', async (req,res) => {
    const members = await guild.members.fetch();
    res.send({"members":members});
})

app.get('/filterRoles/:filter', async (req,res) => {
    const role = await guild.roles.cache.find(r => r.name == req.params.filter);
    const members = await guild.members.fetch();
    const names = members.filter(m => m._roles.includes(role.id));
    res.send({"members":names})
})

app.get('/filterNames/:filter', async (req,res) => {
    const names = await guild.members.fetch({query: req.params.filter,limit:12});
    res.send({"members":names});
})

client.once('ready', async () => {
    guild = await client.guilds.fetch(server.id3);
    console.log('Ready!');
});

client.login(token);

app.listen(port, () => console.log(`App listening on port ${port}`));