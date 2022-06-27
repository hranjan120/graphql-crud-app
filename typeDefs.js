const { gql } = require("apollo-server-express");

const typeDefs = gql`
scalar Upload

type File {
  filename: String!
  mimetype: String!
  encoding: String!
}

type Post{
    id: ID
    title: String
    description: String
    postStatus: String
    createdAt: String
    updatedAt: String
}

type Query {
    hello: String
    getAllPosts: [Post]
    getPost(id: ID): Post
}

input postInput {
    title: String!
    description: String!
    postStatus: String!
}

type Mutation {
    createPost(post: postInput): Post
    deletePost(id: ID): String
    updatePost(id: ID, post: postInput): Post
    #singleUpload(file: Upload!): File!
    imageUploader(file: Upload!): String!
}

`;

module.exports = typeDefs;