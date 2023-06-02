import * as mongoose from 'mongoose';
import { Card } from './Card';

const cardSchema = new mongoose.Schema<Card>({ 
    name: String,
    multiverse_ids: [Number],
    released_at: String,
    image_uris: [String],
    mana_cost: String,
    cmc: Number,
    type_line: String,
    oracle_text: String,
    power: String,
    toughness: String,
    colors: [String],
    color_identity: [String],
    set: String,
    set_name: String,
    rarity: String,
    tags: { type: [String], index: true }
 });

 cardSchema.index({set: 1, rarity: 1});

module.exports = mongoose.model('CardModel', cardSchema, 'cards');