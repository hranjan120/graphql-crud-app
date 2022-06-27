const path = require('path');
const crypto = require('crypto');
const Joi = require('joi');
const { UserInputError } = require("apollo-server-express");
const { GraphQLUpload } = require('graphql-upload');
const fs = require('fs');
const { finished } = require('stream');
const { promisify } = require('util');
const finishedAsync = promisify(finished);
// const { finished } = require('stream');
// const finished = util.promisify(stream.finished);

const Post = require('./models/Post.model'); 

/*
*------------------------------
*/
const resolvers = {
  Upload: GraphQLUpload,

    Query: {
      hello: () => {
       return 'Hello world'
      },
      getAllPosts: async () => {
        const posts = await Post.find();
        return posts;
       },
       getPost: async (parent, args, context, info) => {
        const { id } = args;
        return await Post.findById(id);
       }
    },
    Mutation: {
      createPost: async (parent, args, context, info) => {
        const schema = Joi.object({
          postStatus: Joi.string().required().valid('1', '2').label('Status'),
          title: Joi.string().max(150).required().label('Title'),
          description: Joi.string().max(250).required().label('Description'),
        });
        const {value, error} = schema.validate(args.post, { abortEarly: false });
        if(error){
          throw new UserInputError('Fail to create a post', {
            validationError: error.details
          });
        }

        const { title, description, postStatus } = args.post;
        const postData = new Post({
          title, 
          description, 
          postStatus
        })
        await postData.save();
        return postData;
      },
      deletePost: async (parent, args, context, info) => {
        const { id } = args;
        await Post.findByIdAndRemove(id);
        return "OK, Post Deleted";
      },
      updatePost: async (parent, args, context, info) => {
        const { id } = args;
        const { title, description, postStatus } = args.post;
        const post  = await Post.findByIdAndUpdate(id, { title, description, postStatus }, { new: true });
        return post;
      },
      imageUploader: async (_, {file}) => {
        try {
            let {
                filename,
                createReadStream
            } = await file;
            let stream = createReadStream();

            let {
                ext,
                name
            } = parse(filename);

            name = name.replace(/([^a-z0-9 ]+)/gi, '-').replace(' ', '_');

            let serverFile = path.join(__dirname, `.uploads/${name}-${Date.now()}${ext}`);

            let writeStream = await createWriteStream(serverFile);
            await stream.pipe(writeStream);

            let lastPath = serverFile.split('uploads')[1];
            lastPath = lastPath.replace('\\', '/');
            serverFile = `${URL}${lastPath}`;

            return { serverFile };
        } catch (e) {
            console.log("ERROR UPLOAD A IMAGE", e);
            throw e;
           }
        }
      // singleUpload: async (parent, { file }) => {
      //   console.log('fgbfgbrgb')
      //   const { createReadStream, filename, mimetype, encoding } = await file;
      //   const newFileName = crypto.randomBytes(8).toString('hex') + Date.now().toString() + path.extname(filename)
      //   const stream = createReadStream();
      //   const fileUrl = path.join(__dirname, `./uploads/${newFileName}`);
      //   const imageStream =  fs.createWriteStream(fileUrl)
      //   // Invoking the `createReadStream` will return a Readable Stream.
      //   // See https://nodejs.org/api/stream.html#stream_readable_streams
      //   // This is purely for demonstration purposes and will overwrite the
      //   // local-file-output.txt in the current working directory on EACH upload.
      //   //const out = require('fs').createWriteStream('local-file-output.txt');
      //   stream.pipe(imageStream);
      //   await finishedAsync(imageStream);
      //   return { filename, mimetype, encoding };
      // },
    }
  };

  /*------------------------*/
  module.exports = resolvers;