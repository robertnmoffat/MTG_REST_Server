import * as mongoose from 'mongoose';
import { Card } from './Card';

const cardSchema = new mongoose.Schema<Card>({ name: String });

module.exports = mongoose.model('CardModel', cardSchema, 'cards');