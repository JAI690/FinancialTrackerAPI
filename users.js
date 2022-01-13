module.exports.signup = async (event) => {
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: "Signup successfully!",
          input: event,
        },
        null,
        2
      ),
    };
  };