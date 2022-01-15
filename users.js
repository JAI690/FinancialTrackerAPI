const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const tabla = "users-FTAPI"
function isEmpty(obj) { 
  for (var x in obj) { return false; }
  return true;
}

module.exports = {

  signup: async (event) => {

    const dynamodb = new AWS.DynamoDB.DocumentClient();

    //Recibir datos
    const { name,email,password } = JSON.parse(event.body);

    //Hashing password
    const salt = await bcrypt.genSalt(11);
    const hashPassword = await bcrypt.hash(password, salt);

    //Generar id
    const id = String(Math.random()).slice(2,7)

    //Generar user object
    const params = {
      Item: {
        'UserId': id,
        'name' : name,
        'email' : email,
        'password' : hashPassword
      },
      TableName: tabla,
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
    //Recibir datos
    const { email, password } = JSON.parse(event.body);

    const dynamodb = new AWS.DynamoDB.DocumentClient();

    //Definir parametros
    const params = {
      TableName : tabla,
      Key: {
        'email': email
      }
    };

    let message = '';

    //Realizar consulta
    try {

      const data = await dynamodb.get(params).promise();

      if(isEmpty(data)){
        message = 'email not found'
      }else{
        const validPassword = await bcrypt.compare(password, data.Item.password);

        if(!validPassword){
          message = "password not valid";
        }else{
          const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET)
          message = accessToken;
        }
      }

    } catch (error) {
      console.log(error);
      message = `${error}: could not complete the search.`;
    }

    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message
        },
        null,
        2
      ),
    }
  },

  signin2: async (event) => {
    console.log(event);
    const message = "HOLA";
    return message
  }

}