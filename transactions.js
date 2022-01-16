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
        const fecha = String(Date.now());

        //Generar TRANSACTION_ID
        const id = String(Math.random()).slice(2,15)

        // Create the DynamoDB service object
        var dynamodb = new AWS.DynamoDB.DocumentClient();
        
        var params = {
          TableName: tabla,
          Item: {
            'IdUser' : {S: UserId},
            'TRANSACTION_ID' : {S: id},
            'TRANSACTION_DESCRIPTION' : {S: description},
            'TRANSACTION_CATEGORY' : {S: category},
            'TRANSACTION_SUBCATEGORY' : {S: subcategory},
            'TRANSACTION_PAYMENTMETHOD' : {S: paymentMethod},
            'TRANSACTION_AMOUNT' : {N: amount},
            'TRANSACTION_DATE' : {S: fecha},
            'TRANSACTION_TYPE' : {S: type}
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
        
    }
}