const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, default: '' },
    postStatus: { type: String, enum: ['1', '2'], default: '1' },
},{
  timestamps: true
});

module.exports = mongoose.model('post_test_datas', postSchema);