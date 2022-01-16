const tabla = "transactions-FTAPI"

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');

module.exports = {
    create: async(event) => {

        //Recibir datos del FORM
        const { description, category, subcategory, amount, type, paymentMethod } = JSON.parse(event.body);

        //Obtener userID del token
        const UserId = String(event.requestContext.authorizer.lambda.id);

        //Obtener timestamp
        const tiempo = Date.now()
        const date = new Date(tiempo)
        const fecha = date.toISOString();

        //Generar TRANSACTION_ID
        const id = String(Math.random()).slice(2,15)

        // Create the DynamoDB service object
        var dynamodb = new AWS.DynamoDB.DocumentClient();
        
        var params = {
          TableName: tabla,
          Item: {
            'IdUser' : UserId,
            'TRANSACTION_ID' : id,
            'TRANSACTION_DESCRIPTION' : description,
            'TRANSACTION_CATEGORY' : category,
            'TRANSACTION_SUBCATEGORY' : subcategory,
            'TRANSACTION_PAYMENTMETHOD' : paymentMethod,
            'TRANSACTION_AMOUNT' : Number(amount),
            'TRANSACTION_DATE' : fecha,
            'TRANSACTION_TYPE' : type
          }
        };

        //Insertar Item en DB
        try {
            await dynamodb.put(params).promise();
            message = `Transaction with id ${id} created successfully`;
        } catch (error) {
            console.log(error);
            message = `${error}: could not create transaction.`;
        }

        return message
        
    },

    delete: (event) => {
        console.log(event);

        return {'event': event};
    },

    edit: (event) => {
        console.log(event);
        return event

    },

    get: (event) => {

    }
}