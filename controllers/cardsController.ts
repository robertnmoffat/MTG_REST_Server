import { Request, Response } from "express";
const { Model } = require('mongoose');
import { Card } from "models/Card";

type ReqQuery = { q: string };//Defining so that req.query can be referenced
type ReqParams = { set: string, start: string };
type SelectedCard = { name: string };

/**
 * Specifies the fields to be selected from database
 */
const cardFieldSelection = {
    _id: 0,
    name: 1,
    multiverse_ids: 1,
    released_at: 1,
    image_uris: 1,
    mana_cost: 1,
    cmc: 1,
    type_line: 1,
    oracle_text: 1,
    power: 1,
    toughness: 1,
    colors: 1,
    color_identity: 1,
    set: 1,
    set_name: 1,
    rarity: 1
}

/**
 * Creates an object representing database data to be returned by API
 * @param cards Card array returned from database
 * @param req HTTP Request
 * @param res HTTP Response
 * @returns JSON object representing the card array with HATEOAS links
 */
function createReturnObject(cards: [Card], req: Request<ReqParams>, res: Response) {
    const homeURL = req.protocol + '://' + req.get('host');

    const returnObj = {
        cards: cards,
        links: { // Create HATEOAS links to assist in navigation
            previous:
                req.params.start ? Number(req.params.start) - 10 > 0 ? // Check if the previous ten will be at zero
                    (`${homeURL}/api/cards/${req.params.set}/${Number(req.params.start) - 10}`)
                    : (`${homeURL}/api/cards/${req.params.set}`)
                    : "",
            next: (`${homeURL}/api/cards/${req.params.set}/${Number(req.params.start) ? Number(req.params.start) + 10 : 10}`)
        }
    }

    return returnObj;
}

/**
 * Controller function for all card requests
 * @param CardModel Mongoose model representing the card collection
 * @returns Functions to be routed to
 */
function cardsController(CardModel: typeof Model) {
    function getWithSet(req: Request<ReqParams>, res: Response) {

        //If the url has a start position specified
        if (req.params.start) {

            CardModel.find({ set: req.params.set }, cardFieldSelection).skip(req.params.start).limit(10)
                .then((cards: [Card]) => {

                    const returnObj = createReturnObject(cards, req, res);

                    res.send(returnObj);
                }).catch((err: Error) => { console.log(`Error:${err}`) });
        } else {

            CardModel.find({ set: req.params.set }, cardFieldSelection).limit(10)
                .then((cards: [Card]) => {

                    const returnObj = createReturnObject(cards, req, res);

                    res.send(returnObj);
                }).catch((err: Error) => {
                    console.log(`Db return error:${err}`)
                    res.send('Error');
                });
        }
    }

    function getWithId(req: Request, res: Response) { }

    return { getWithId, getWithSet };
}

module.exports = cardsController;