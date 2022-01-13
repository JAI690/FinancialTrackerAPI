module.exports = {

  signup: async (event) => {
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: "Signup successfully!",
        },
        null,
        2
      ),
    }
  },

  signin: async (event) => {
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: "Signin successfully!",
        },
        null,
        2
      ),
    }
  },

}