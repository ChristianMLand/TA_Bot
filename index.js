const Discord = require('discord.js');
const client = new Discord.Client();
const axios = require('axios');
const {prefix,token,me,server,urls} = require('./config/config.json');
const Student = require("./models/student.model");
let guild;
require("./config/mongoose.config");

const corn = [
    ["╔","╦","╗"],
    ["╠","╬","╣"],
    ["╚","╩","╝"],
    ["║","║","║"]
]
const emojiMap = {
    '😎':"Ahead",
    '😄':"On Pace",
    '😦':"Behind",
    '💀':"Very Behind"
}

const isMe = member => member.id === me.id;
const addStudent = (msg,user,comment) => {
    let name = user;
    if(!(typeof(user) == "string")){
        name = user.nickname || user.user.username;
    }
    Student.create({
        name : name,
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
const drawRow = (n,c,i,u) => {
    let [v1,v2,spc] = ["","","═"];
    if(u){
        [v1,v2] = u;
        spc = " ";
    }
    return `${corn[i][0]+v1+spc.repeat(n-v1.length)+corn[i][1]+v2+spc.repeat(c-v2.length)+corn[i][2]}\n`;
}
const drawTable = users => {
    let cols = ["Name","Comment"];
    let [n,c] = [cols[0].length,cols[1].length]
    for(let user of users){
        n = Math.max(n,user.name.length);
        c = Math.max(c,user.comment.length);
    }
    let tableStr = drawRow(n,c,0)+drawRow(n,c,3,cols)+drawRow(n,c,1)//draw header
    for(let i = 0; i < users.length-1; i++){
        let {name,comment,discord_id} = users[i];
        tableStr += drawRow(n,c,3,[name,comment])+drawRow(n,c,1);//draw rows
    }
    let {name,comment,discord_id} = users[users.length-1]
    tableStr += drawRow(n,c,3,[name,comment])+drawRow(n,c,2)//draw bottom
    return tableStr;
}
const findStudent = async (attr,id) => {
    console.log(attr,id);
    return Student.findOne({attr:id});
}
const updateStudent = async (msg,id,com) => {
    Student.findByIdAndUpdate(id,{comment:com})
    .then(stu => msg.channel.send(`Successfully updated ${stu.name}`))
    .catch(err => console.log(err));
}
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
                    .setTitle(`Strugglers`)
                    .setDescription(`\`\`\`${drawTable(allStudents)}\`\`\``)
            )
        })
        .catch(err => console.log("Something went wrong " + err));
    },
    add : async (msg,args) => {
        let [id,...c] = args;
        if(id[0] == "<"){
            id = id.slice(3,id.length-1);
        }
        c = c.join(" ");
        let usr = msg.guild.members.cache.find(u => u.id === id);
        let stu = await Student.findOne({discord_id:id})
        // let stu = await findStudent("discord_id",id);
        if(usr){
            if(stu){
                updateStudent(msg,stu.id,c);
            }else{
                addStudent(msg,usr,c);
            }
        }else{
            stu = await Student.findOne({name:id});
            // stu = await findStudent("name",id);
            console.log(stu);
            if(stu){
                updateStudent(msg,stu.id,c);
            }else{
                addStudent(msg,id,c)
            }
        }
    },
    remove : async (msg,args) => {
        let user = args[0];
        Student.findOneAndDelete({name:user})
        .then(stu => {
            msg.channel.send(`Successfully deleted ${stu.name}`)
        })
        .catch(err => {
            msg.channel.send("User doesn't exist!");
        });
    }
}
client.once('ready', async () => {
    guild = await client.guilds.fetch(server.id3);
    console.log('Ready!');
});
client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();
    if(command in commands){
        commands[command](message,args);
    }
});
// client.on('messageReactionAdd', async msg => {
//     const c = emojiMap[msg._emoji.name];
//     const m = msg.message.content;
//     if(m[0] == "<"){
//         const id = m.slice(3,m.length-1);
//         const usr = await guild.members.fetch(id);
//         const stu = await Student.findOne({discord_id:id})
//         if(stu){
//             updateStudent(msg.message,stu.id,c);
//         }else if(usr){
//             addStudent(msg.message,usr,c);
//         } else {
//             msg.message.channel.send("Student couldn't be found")
//         }
//     } else {
//         const stu = await Student.findOne({name:m});
//         if(stu){
//             updateStudent(msg.message,stu.id,c);
//         }else{
//             addStudent(msg.message,)
//         }
//     }
// });
client.login(token);