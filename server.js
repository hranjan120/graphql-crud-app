const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const { ApolloServer } = require("apollo-server-express");
const { graphqlUploadExpress } = require('graphql-upload');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');

/*-------------------*/
const app = express();


async function startServer(){
  try{
  const app = express();
  const apolloServer = new ApolloServer({ typeDefs, resolvers, csrfPrevention: true, });
  await apolloServer.start();
  app.use(express.static(path.join(__dirname, './uploads')));
  app.use(graphqlUploadExpress({ maxFileSize: 1000000000, maxFiles: 10 }));
  apolloServer.applyMiddleware({ app, path: '/graphqls' });

  app.use((req, res)=>{
    res.send('👋 Hello by SW Mobile App 😐');
  });

  await mongoose.connect('mongodb+srv://db-user-name:db-pwd@cluster0.lnmwa.mongodb.net/master_location_db?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  console.log('connected to database');

  app.listen(3000, () => {
    console.log('Listening on port 3000');
  });
} catch(err){
  console.log(err);
}
}
startServer();
