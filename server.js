const discord = require("discord.js");
const axios = require("axios")
const intents = new discord.Intents();
const prefix = "!avs";
require("dotenv").config();
const client = new discord.Client({
    intents: [
        discord.Intents.FLAGS.GUILDS,
        discord.Intents.FLAGS.GUILD_MESSAGES
    ] 
});

client.on("ready", () => {
    console.log("Bot is listening, has started")
})

client.on("messageCreate", message => {
    if(message.content.startsWith(prefix)){
        var args = message.content.slice(Number(prefix.length)+Number(1)).split(/ +/);
        console.log(args);
        if(args[0]=="verify"){
            axios.get(`https://robloxavs.herokuapp.com/get/`+args[1]).then(function(data){
                if(message.author.username==data.data.user){
                    message.channel.send(`Hello **${data.data.user}**,Thanks for choosing AVS! Please sent a message in the following format "**!avs verifycode [Your avs verification code here] [Your account number here]**", ex. "**!avs verifycode 11388 2**"`);
                    message.react('✅')
                    }else{
                        message.channel.send(`Your username doesn't matches the record of your account number! Code: **FAILED_VERIFICATION_INVAILD_USERNAME**`);
                        message.react('❌')
                    }
                })
            }
            if(args[0]=="verifycode"){
                if(args[1].length>=4){
                    axios.get(`https://robloxavs.herokuapp.com/get/`+args[2]).then(function(data){
                        if(data.data.user==message.author.username){
                            if(data.data.code==args[1]){
                                message.reply(`Verification passed !:white_check_mark: Welcome to AVS!`)
                                message.react('✅')
                                const { guild } = message
                                var role = guild.roles.cache.find((role) => {
                                    return role.name == "Verified"
                                })
                                message.member.roles.add(role)
                            //     setInterval(() => {
                            //     message.delete()
                            // }, secs(5));
                        }else{
                        message.reply("Looks like your code is **invaild**! Please try again. **VERIFICATION_CODE_NO_MATCH**")
                        message.react('❌')
                    }
                }else{
                    message.reply("Looks like your account number is **invaild**! Please try again. **VERIFICATION_ACC_NUM_NO_MATCH**")
                    message.react('❌')
                }
            })
            }else{
                message.reply("Verification code should have **4 digits**! Please try again. **VERIFICATION_CODE_LENGTH_NOT_4**")
                message.react('❌')
            }
        }
    }
})

function secs(number){
    return number+000
}
secs(5)
client.login(process.env.TOKEN)