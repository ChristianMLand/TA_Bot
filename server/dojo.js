const Discord = require('discord.js');
const client = new Discord.Client();
const {prefix,token,me} = require('../../config.json');

client.once('ready', () => {
    console.log('Ready!');
});
const isMe = member => member.id === me.id;
const actions = {
    "add": (user,roles) => {
        user.roles.add(roles).then(res =>{
            console.log("successfully added roles");
        }).catch(err => {
            console.log("role was not found");
        })
    },
    "remove": (user,roles) => {
        user.roles.remove(roles).then(res =>{
            console.log("successfully remove roles");
        }).catch(err => {
            console.log("role was not found");
        })
    },
    "set":(user,roles) => {
        user.roles.set(roles).then(res =>{
            console.log("successfully set roles");
        }).catch(err => {
            console.log("role was not found");
        })
    }
}
const getIds = args => args.map(u => u.slice(3,u.length-1));
const doAction = (msg,args,act) => {
    let users = [];
    let roles = [];
    for(let id of getIds(args)){
        let u = msg.guild.members.cache.find(u => u.id === id);
        let r = msg.guild.roles.cache.find(r => r.id === id);
        if(u){
            users.push(u);
        }
        else if(r){
            roles.push(r);
        }
    }
    for(let user of users){
        actions[act](user,roles);
    }
};

const commands = {
    addroles : (msg,args) => {
        doAction(msg,args,"add");
    },
    removeroles : (msg,args) => {
        doAction(msg,args,"remove");
    },
    setroles : (msg,args) => {
        doAction(msg,args,"set");
    }
}
client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();
    if(command in commands){
        commands[command](message,args);
    }
});
client.login(token);