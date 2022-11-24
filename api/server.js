require("dotenv").config();
const cors = require('cors');
const colors = require("colors");
const express = require("express");
const jwt = require('jsonwebtoken');
const models = require('./src/models');
const schema = require('./src/schema');
const connectDB = require('./src/db/config');
const depthLimit = require('graphql-depth-limit');
const { ApolloServer } = require("apollo-server-express");
const { createComplexityLimitRule } = require("graphql-validation-complexity");

// GraphQL's Schema `Query`
const typeDefs = require('./src/schema');

// GraphQL resolvers (queries and mutations functions)
const resolvers = require('./src/resolvers');

// create express app
const app = express();

// connect to DB
connectDB();

// enable cors for all origin
app.use(cors());

// init PORT
const PORT = process.env.PORT || 8000;

// get the user from a JWT
const getUser = token => {
  if (token) {
    try {
      // return the user information from the token
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      // if there's a problem with the token, throw an error
      throw new Error("Session invalid");
    }
  }
}

// create server instance of Apollo Server
const server = new ApolloServer({ 
    typeDefs, 
    resolvers, 
    validationRules: [ 
      depthLimit(5),
      // Allow a maximum query cost of 1000
      createComplexityLimitRule(1000) 
    ],
    context: ({ req }) => {
      // get the user token from the headers
      const token = req.headers.authorization;

      // try to retrieve a user with the token
      const user = getUser(token);

      // for now, let's log the user to the console:
      // console.log(user);
      
      // add the db models and user to the context
      return { models, user };
    } 
});

app.get("/", (req, res) => res.send("Hello World!"));

server.start().then(() => {
  //Apply the Apollo GraphQL middleware and set the path to /api
  server.applyMiddleware({ app, path: "/graphql" });

  // run app
  app.listen(PORT, () =>
    console.log(
      `Server is running at http://localhost:${PORT}`.cyan.underline.bold
    )
  );
});
