const SlackBot = require('slackbots');
var fs = require('fs');

module.exports = {
    getBot: () => {
        const token = JSON.parse(fs.readFileSync('./token.json', 'utf8')).token;
        console.log(token);

        return new SlackBot({
            token,
            name: 'microclimate-bot'
        });
    }
}