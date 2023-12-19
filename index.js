// index.js
const express = require('express');
const schema = require('./schema/schema');
const bodyParser = require('body-parser');
const usersRoutes = require('./routes/users');
const sequelize = require('./config/database');
const { graphqlHTTP } = require('express-graphql');


const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/users', usersRoutes);

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true, // Enable the GraphiQL UI for testing
}));

// Test the database connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

// Sync models with the database
sequelize.sync({ force: true }) // Use force: true only during development to drop and recreate tables
  .then(() => {
    console.log('Database and tables synced.');
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
