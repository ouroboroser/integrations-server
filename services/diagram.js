const md5 = require('md5');
const { v4: uuidv4 } = require('uuid');

class Diagram {
    async generateApiKey(user) {
        const generatedKeyUsingUuid = uuidv4().split('-').join('');
        const generatedKeyUsingUserEmail = md5(user.email);

        return generatedKeyUsingUuid + generatedKeyUsingUserEmail;
    };
};

const diagram = new Diagram();

module.exports = {
    diagram
};