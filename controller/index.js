module.exports = (postgresClient) => {
    const clientProfileController = require('./ClientProfileController')(postgresClient);

    return {
        clientProfileController
    };
}