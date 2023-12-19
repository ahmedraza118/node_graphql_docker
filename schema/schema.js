// schema.js
const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLList } = require('graphql');
const  User  = require('.././models/user');
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
  },
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(parent, args) {
        return User.findByPk(args.id);
      },
    },
    users: {
      type: new GraphQLList(UserType),
      resolve() {
        return User.findAll();
      },
    },
  },
});

const RootMutation = new GraphQLObjectType({
  name: 'RootMutationType',
  fields: {
    createUser: {
      type: UserType,
      args: {
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        email: { type: GraphQLString },
      },
      async resolve(parent, args) {
        try{
            const user = await User.create(args);
            return user;
        }catch (error) {
            console.error(error);
            throw new Error('Failed to create user');
        }
      },
    },
    updateUser: {
      type: UserType,
      args: {
        id: { type: GraphQLString },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        email: { type: GraphQLString },
      },
      resolve(parent, args) {
        return User.update(args, {
          where: { id: args.id },
          returning: true,
        }).then(([rowsUpdated, [updatedUser]]) => updatedUser);
      },
    },
    deleteUser: {
      type: UserType,
      args: {
        id: { type: GraphQLString },
      },
      resolve(parent, args) {
        return User.findByPk(args.id).then((user) => {
          if (!user) return null;
          return user.destroy().then(() => user);
        });
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});
