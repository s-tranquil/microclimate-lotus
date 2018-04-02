const request = require('request');
const fs = require('fs');

const tokenReader = require('./token-reader');

module.exports = {
    uploadImage: (path) => {
        const token = tokenReader.getToken();

        const options = {
            channels: 'microclimate',
            token: token,
            file: fs.createReadStream(path),
            filename: path.split("/")[1],
            filetype: "png"
        }

        const r = request.post({
            url: "https://slack.com/api/files.upload",
            formData: options
        });
    }
}