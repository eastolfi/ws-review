var Discord = require('discord.io');
// var logger = require('winston');
var auth = require('./auth.json');
const https = require("https");

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

const fetchReview = () => {
    return new Promise((resolve, reject) => {
        https.get("https://www.wanikani.com/api/user/9922522cc9ab8c79c010debe6f316656/study-queue", (resp) => {
            let data = "";
        
            resp.on("data", chunk => {
                data += chunk
            });
        
            resp.on("end", () => {
                resolve(JSON.parse(data));
            });
        }).on("error", error => {
            reject(error);
        });
    });
};

const unixTimestampToDate = (ts) => {
    if (!ts || isNaN(ts)) {
        return null;
    } else {
        return new Date(ts * 1000);
    }
}

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
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
       
        args = args.splice(1);
        switch(cmd) {
            // !ping
            case 'ping':
                fetchReview()
                .then(result => {
                    bot.sendMessage({
                        to: channelID,
                        message: `The next review will be the ${unixTimestampToDate(result.requested_information.next_review_date)}`
                    });
                })
                .catch(error => {
                    bot.sendMessage({
                        to: channelID,
                        message: `Error: ${error.message}`
                    });
                });
                break;
                // Just add any case commands if you want to..
         }
     }
});
bot.on('disconnect', function(errMsg, code) {
    console.log(errMsg);
    console.log(code);
});
