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

        let message = '';

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

    delete: async(event) => {
        //Extraer TRANSACTION_ID
        const transactionID = event.pathParameters.id;

        //Obtener userID del token
        const UserId = String(event.requestContext.authorizer.lambda.id);

        // Create the DynamoDB service object
         var dynamodb = new AWS.DynamoDB.DocumentClient();
        
         var params = {
           TableName: tabla,
           Key: {
             'IdUser' : UserId,
             'TRANSACTION_ID' : transactionID,
           }
         };
 
         let message = '';
 
         //Eliminar Item en DB
         try {
             await dynamodb.delete(params).promise();
             message = `Transaction with id ${transactionID} was deleted successfully`;
         } catch (error) {
             console.log(error);
             message = `${error}: could not delete transaction.`;
         }

        return {message}
    },

    edit: async(event) => {

        //Extraer TRANSACTION_ID
        const transactionID = String(event.pathParameters.id);

        //Obtener userID del token
        const UserId = String(event.requestContext.authorizer.lambda.id);

        //Recibir datos del FORM
        const { description, category, subcategory, amount, type, paymentMethod, date } = JSON.parse(event.body);

        // Create the DynamoDB service object
        const dynamodb = new AWS.DynamoDB.DocumentClient();

        const params = {
            TableName: tabla,
            Key:{
                'IdUser' : UserId,
                'TRANSACTION_ID' : transactionID,
            },
            UpdateExpression: 
                "set TRANSACTION_DESCRIPTION = :d, TRANSACTION_CATEGORY = :c, TRANSACTION_SUBCATEGORY = :s, TRANSACTION_PAYMENTMETHOD = :pm, RANSACTION_AMOUNT = :a ,TRANSACTION_DATE = :dt , TRANSACTION_TYPE = :t",
            ExpressionAttributeValues:{
                ":d": description,
                ":c": category,
                ":s": subcategory,
                ":a": amount,
                ":t": type,
                ":pm": paymentMethod,
                ":dt": date
            },
        };

        let message = '';
 
        //Editar Item en DB
        try {
            await dynamodb.update(params).promise();
            message = `Transaction with id ${transactionID} was updated successfully`;
        } catch (error) {
            console.log(error);
            message = `${error}: could not update transaction.`;
        }

        console.log(message)

       return {message}

    },

    get: async(event) => {

        //Obtener userID del token
        const UserId = String(event.requestContext.authorizer.lambda.id);  

        // Create the DynamoDB service object
        const dynamodb = new AWS.DynamoDB.DocumentClient();      

        var params = {
            TableName : tabla,
            KeyConditionExpression: "#id = :iduser",
            ExpressionAttributeNames:{
                "#id": "IdUser"
            },
            ExpressionAttributeValues: {
                ":iduser": UserId
            }
        };

        let message = '';
 
        //Obtener transactions en DB
        try {
            const data = await dynamodb.query(params).promise();
            message = `Transaction with id ${data} was updated successfully`;
        } catch (error) {
            console.log(error);
            message = `${error}: could not update transaction.`;
        }

        console.log(message)

       return {message}
        
    }
}