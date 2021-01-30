const users = [
    {name: "Chris",pace:5,comment:"hello world this is my comment"},
    {name: "Christian",pace:5,comment:"hi world"},
    {name: "Chris Land",pace:5,comment:"hello"},
    {name: "Christian Land",pace:5,comment:"hi"}
]
const corn = [
    ["╔","╦","╗"],
    ["╠","╬","╣"],
    ["╚","╩","╝"],
    ["║","║","║"]
]
const drawRow = (n,p,c,i,u) => {
  let [v1,v2,v3] = u || ["","",""];
  let spc = u ? " " : "═";
  return `${corn[i][0]+v1+spc.repeat(n-v1.length)+corn[i][1]+v2+spc.repeat(p-v2.toString().length)+corn[i][1]+v3+spc.repeat(c-v3.length)+corn[i][2]}\n`;
}
const drawTable = users => {
    let cols = ["Name","value","Comment"];
    let [n,p,c] = [cols[0].length,cols[1].length,cols[2].length]
    let tableStr = "";
    for(let user of users){
        n = Math.max(n,user.name.length);//get longest name
        p = Math.max(p,`${user.pace}`.length);//get longest value
        c = Math.max(c,user.comment.length);//get longest comment
    }
    tableStr += drawRow(n,p,c,0)+drawRow(n,p,c,3,cols)+drawRow(n,p,c,1)//draw header
    for(let i = 0; i < users.length-1; i++){
        tableStr += drawRow(n,p,c,3,Object.values(users[i]))+drawRow(n,p,c,1);//draw rows
    }
    tableStr += drawRow(n,p,c,3,Object.values(users[users.length-1]))+drawRow(n,p,c,2)//draw bottom
    return tableStr;
}
drawTable(users);