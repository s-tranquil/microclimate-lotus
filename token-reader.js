const fs = require('fs');

module.exports = {
    getToken: () => JSON.parse(fs.readFileSync('./token.json', 'utf8')).token
}