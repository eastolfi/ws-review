var Discord = require('discord.io');
// var logger = require('winston');
var auth = require('./auth.json');

const { ReviewTask } = require("./src/tasks");

// Configure logger settings
// logger.remove(logger.transports.Console);
// logger.add(logger.transports.Console, {
//     colorize: true
// });
// logger.format.combine(
//     logger.format.colorize(),
//     logger.format.json()
// );
// logger.level = 'debug';
// Initialize Discord Bot

var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    // logger.info('Connected');
    // logger.info('Logged in as: ');
    // logger.info(bot.username + ' - (' + bot.id + ')');
    console.log('Connected');
    console.log('Logged in as: ');
    console.log(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', async (user, userID, channelID, message, evt) => {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
       
        args = args.splice(1);
        
        let msg = "";
        
        try {
            switch(cmd) {
                // !ping
                case 'reviews':
                    msg = await ReviewTask.run();

                    break;
            }
        } catch(error) {
            msg = `Error while fetching the reviews: ${error.message}`;
        }
        
        bot.sendMessage({
            to: channelID,
            message: msg
        });
     }
});
bot.on('disconnect', function(errMsg, code) {
    console.log(errMsg);
    console.log(code);
});
