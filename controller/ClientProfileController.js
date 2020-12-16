'use strict';

/**
 * 
 * Controller for Handling Operations related to the Transient Token.
 * 
 * @param {Sequelize Object} postgresClient Client to use for Postgres Database Operations
 * 
 */
module.exports = (postgresClient) => {
    
    //Importing Modules
    const model = require('../models');

    //Initializing Variables
    const Models = model(postgresClient);
    const clientProfileModel = Models.ClientProfileModel;
    const clientCredentialModel = Models.clientCredentialModel;

    const getClientProfile = async (clientId) => {
        const profile = await clientProfileModel.findAll(
            { where: { client_id: clientId }},
            { include: { model: clientCredentialModel }}
        );

        if(profile.length === 0) {
            return 'No Such Profile Exists';
        }
        return profile[0]['dataValues'];
    }

    return {
        getClientProfile
    };
}