const SlackBot = require('slackbots');

const tokenReader = require('./token-reader');

module.exports = {
    getBot: () => {
        const token = tokenReader.getToken();
        return new SlackBot({
            token,
            name: 'microclimate-bot'
        });
    }
}