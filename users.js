const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs')

module.exports = {

  signup: async (event) => {

    const dynamodb = new AWS.DynamoDB.DocumentClient();

    //Recibir datos
    const { name,email,password } = JSON.parse(event.body);

    //HAshing password
    const salt = await bcrypt.genSalt(11);
    const hashPassword = await bcrypt.hash(password, salt);

    //Generar id
    const id = String(Math.random()).slice(2,7)

    const params = {
      Item: {
        'UserId': id,
        'name' : name,
        'email' : email,
        'password' : hashPassword
      },
      TableName: 'users',
    }



    //Mensaje de estatus final
    let message = '';

    //Insertar Item en DB
    try {
      await dynamodb.put(params).promise();
      message = `User with id ${id} created successfully`;
    } catch (error) {
      console.log(error);
      message = `${error}: could not create user.`;
    }

    //Mandar mensaje de estatus final
    return message
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