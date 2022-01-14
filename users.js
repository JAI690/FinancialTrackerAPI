const AWS = require('aws-sdk');

module.exports = {

  signup: async (event) => {
    
    const dynamodb = new AWS.DynamoDB.DocumentClient();
    const id = String(Math.random()).slice(2,7)
    const params = {
      Item: {
        'UserId': id,
        'name' : 'brayan',
        'email' : 'jai690@hotmail.com',
        'password' : 'ejemplo'
      },
      TableName: 'users',
    }

    return dynamodb.put(params).promise().then(()=>{
      return id;
    });
  },

  signin: async (event) => {
    const { email } = JSON.parse(event.body);

    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: "Signin successfully!",
          email
        },
        null,
        2
      ),
    }
  },

}