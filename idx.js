const Discord = require('discord.js');
const client = new Discord.Client();
const axios = require('axios');
const {prefix,token,me,urls} = require('./config/config.json');

require("./config/mongoose.config");
const Student = require("./models/student.model");

client.once('ready', () => {
    console.log('Ready!');
});
const isMe = member => member.id === me.id;
const commands = {
    search : async (msg,args) => {
        if(isMe(msg.member)){
            [site,...query]= args;
            axios.get(`${urls[site]}?q=${query}`)
            .then(resp => {
                result = resp.data.documents[0];
                console.log(result);
                msg.channel.send(
                    new Discord.MessageEmbed()
                    .setColor('#00099ff')
                    .setURL(`${urls[site]}`)
                    .setTitle(`${result.title}`)
                    .setDescription(`${result.excerpt}`)
                );
            })
            .catch(err => {
                console.log(resp)
            });
        } else {
            msg.channel.send("You do not have permission to use that command!");
        }
    },
    table : (msg,args) => { 
        Student.find()
        .then(allStudents => {
            msg.channel.send(
                new Discord.MessageEmbed()
                    .setColor('#00099ff')
                    .setTitle(`Students`)
                    .setDescription(`${drawTable(allStudents)}`)
            )
        })
        .catch(err => console.log("Something went wrong " + err));
    }
}
const addStudent = (msg,user,comment) => {
    Student.create({
        name : user.nickname,
        comment: comment,
        discord_id: user.id
    })
    .then(newStudent => {
        console.log(newStudent.name);
        console.log(newStudent.comment);
        msg.channel.send(`Successfully added ${newStudent.name} to DB`)
    })
    .catch(err => res.json({ message: "Something went wrong", error: err }));
}
const corn = [
    ["╔","╦","╗"],
    ["╠","╬","╣"],
    ["╚","╩","╝"],
    ["║","║","║"]
]
const drawRow = (n,c,i,u) => {
  let [v1,v2] = u || ["","",""];
  let spc = u ? " " : "═";
  return `${corn[i][0]+v1+spc.repeat(n-v1.length)+corn[i][1]+v2+spc.repeat(c-v2.length)+corn[i][2]}\n`;
}
const drawTable = users => {
    let cols = ["Name","Comment"];
    let [n,c] = [cols[0].length,cols[1].length]
    let tableStr = "";
    for(let user of users){
        n = Math.max(n,user.name.length);//get longest name
        c = Math.max(c,user.comment.length);//get longest comment
    }
    tableStr += drawRow(n,c,0)+drawRow(n,c,3,cols)+drawRow(n,c,1)//draw header
    for(let i = 0; i < users.length-1; i++){
        let {name,comment,discord_id} = users[i];
        console.log(name,comment)
        tableStr += drawRow(n,c,3,[`<@${discord_id}>`,comment])+drawRow(n,c,1);//draw rows
    }
    let {name,comment,discord_id} = users[users.length-1]
    tableStr += drawRow(n,c,3,[`<@${discord_id}>`,comment])+drawRow(n,c,2)//draw bottom
    return tableStr;
}
client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();
    if(command in commands){
        commands[command](message,args);
    }
});
emojiMap = {
    '😎':"Ahead",
    '😄':"On Pace",
    '😦':"Behind",
    '💀':"Very Behind"
}
const findStudent = async id => {
    return Student.findOne({discord_id:id});
}
const updateStudent = async (msg,id,com) => {
    Student.findByIdAndUpdate(id,{comment:com})
    .then(stu => msg.channel.send(`Successfully updated ${stu.name}`))
    .catch(err => console.log(err));
}
client.on('messageReactionAdd', async msg => {
    let c = emojiMap[msg._emoji.name];
    let m = msg.message.content;
    let id = m.slice(3,m.length-1);
    let usr = msg.message.guild.members.cache.find(u => u.id === id);
    let stu = await findStudent(id);
    if(stu){
        updateStudent(msg.message,stu.id,c);
    }else{
        addStudent(msg.message,usr,c);
    }
});
client.login(token);