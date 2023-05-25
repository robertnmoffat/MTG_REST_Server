import * as mongoose from 'mongoose';

const cardSchema = new mongoose.Schema({name: String});

module.exports = mongoose.model('CardModel', cardSchema, 'cards');