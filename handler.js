'use strict';

const postgresClient = require('./connections/PostgresConnection')('production');
const crypto = require('crypto');

postgresClient.authenticate()
.then(() => console.log('Database Connected Successfully'));

const Controller = require('./controller')(postgresClient);

module.exports.app = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;

    try {
        const clientProfileController = Controller.clientProfileController;
    
        const clientEmail = event.queryStringParameters.client_email;

        const MagicWord = process.env.MAGIC_WORD;

        const emailSalted = clientEmail + "" + MagicWord;
        const clientId = crypto.createHash('sha256').update(emailSalted).digest('base64');
    
        const profile = await clientProfileController.getClientProfile(clientId);
    
        const response = {
            MESSAGE: 'DONE',
            RESPONSE: 'Client Profile Fetched!',
            CODE: 'CLIENT_PROFILE_FETCHED',
            PROFILE: profile
        };

        return {
            statusCode: 200,
            body: JSON.stringify(response)
        };
    } catch(err) {
        console.error(`ERR: ${JSON.stringify(err.message)}`);

        const response = {
            ERR: err.message,
            RESPONSE: 'Client Profile Fetching Failed!',
            CODE: 'CLIENT_PROFILE_FETCH_FAILED'
        };

        return {
            statusCode: 400,
            body: JSON.stringify(response)
        };
    }
}