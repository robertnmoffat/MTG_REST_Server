# MTG Card Rest API

This project is a REST API to request Magic the Gathering card information and randomized packs from specified sets.

## Usage

The API is currently hosted at [this address.](http://143.198.62.169:3333/api)

### Card Response Structure

```javascript
{
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
}
```

### API Endpoints

<b>`GET /api/cards/:set`</b>

<table>
  <tr>
    <th>Parameter</th>
    <th>Definition</th>
  </tr>
  <tr>
    <td>set</td>
    <td>The set to get cards from</td>
  </tr>
</table>

<b>Returns:</b><br>
An array of ten cards from the given set. The cards follow the structure defined above.<br><br>


<b>`GET /cards/:set/:start`</b>

<table>
  <tr>
    <th>Parameter</th>
    <th>Definition</th>
  </tr>
  <tr>
    <td>set</td>
    <td>The set to query cards from</td>
  </tr>
  <tr>
    <td>start</td>
    <td>Offset to start the ten cards from</td>
  </tr>
</table>

<b>Returns:</b><br>
An array of ten cards from the given set offset by the start parameter. The cards follow the structure defined above.<br><br>


<b>`GET /cards`</b>

<table>
  <tr>
    <th>Query</th>
    <th>Definition</th>
  </tr>
  <tr>
    <td>id</td>
    <td>The multiverse id of the card to be returned</td>
  </tr>
</table>

<b>Returns:</b><br>
A single card with the query id following the structure defined above.<br>

Example:<br>
```javascript
{
  "multiverse_ids":[75404],
  "name":"Serpent Skin",
  "released_at":"2004-10-01",
  "image_uris":{
    "small":"https://cards.scryfall.io/small/front/8/c/8c5722d9-d1a4-4ad2-bf85-db666d4a30d9.jpg?1562762476",
    "normal":"https://cards.scryfall.io/normal/front/8/c/8c5722d9-d1a4-4ad2-bf85-db666d4a30d9.jpg?1562762476",
    "large":"https://cards.scryfall.io/large/front/8/c/8c5722d9-d1a4-4ad2-bf85-db666d4a30d9.jpg?1562762476",
    "png":"https://cards.scryfall.io/png/front/8/c/8c5722d9-d1a4-4ad2-bf85-db666d4a30d9.png?1562762476",
    "art_crop":"https://cards.scryfall.io/art_crop/front/8/c/8c5722d9-d1a4-4ad2-bf85-db666d4a30d9.jpg?1562762476",
    "border_crop":"https://cards.scryfall.io/border_crop/front/8/c/8c5722d9-d1a4-4ad2-bf85-db666d4a30d9.jpg?1562762476"
  },
  "mana_cost":"{2}{G}",
  "cmc":3,
  "type_line":"Enchantment — Aura",
  "oracle_text":"Flash\nEnchant creature\nEnchanted creature gets +1/+1.\n{G}: Regenerate enchanted creature.",
  "colors":["G"],
  "color_identity":["G"],
  "set":"chk",
  "set_name":"Champions of Kamigawa",
  "rarity":"common"
}
```
<br>

<b>`GET /packs/:set`</b>

<table>
  <tr>
    <th>Parameter</th>
    <th>Definition</th>
  </tr>
  <tr>
    <td>set</td>
    <td>The set to query cards from</td>
  </tr>
</table>

<b>Returns:</b><br>
A randomized pack from the requested set. Packs contain: 1 either mythic or rare, 3 uncommons, 10 commons.<br><br>


<b>`GET /sets`</b>

<b>Returns:</b><br>
An array containing the abbreviated names of every set contained within the database.<br><br>
