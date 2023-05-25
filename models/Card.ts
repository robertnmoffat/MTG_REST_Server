/**
 * The mtg card interface to be used by the API
 */
export interface Card {
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
    rarity: String
};