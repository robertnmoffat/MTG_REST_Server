import { Request, Response } from "express";
const { Model } = require('mongoose');
import { Card } from "models/Card";
import { setNames } from "../data/supportedSets";
import { cardFieldSelection } from "../data/cardFieldSelection";

type ReqQuery = { q: string };//Defining so that req.query can be referenced
type ReqParams = { set: string, start: string };
type SelectedCard = { name: string };


/**
 * Creates an object representing database data to be returned by API
 * @param cards Card array returned from database
 * @param req HTTP Request
 * @param res HTTP Response
 * @returns JSON object representing the card array with HATEOAS links
 */
function createReturnObject(cards: [Card], req: Request, res: Response) {
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

    /**
     * Get's a card from the database using it's multiverse id
     * @param req HTTP request
     * @param res HTTP response
     */
    async function getWithId(req: Request, res: Response) {
        if (req.query.id) {
            const id = Number(req.query.id);

            CardModel.findOne({ multiverse_ids: id }, cardFieldSelection)
                .then((card: Card) => {
                    res.send(card);
                }).catch((err: Error) => {
                    console.log(`Db return error:${err}`)
                    res.send('Error');
                });
        } else {
            res.send("Error: Card multiverse ID required.");
        }
    }

    return { getWithId, getWithSet };
}

module.exports = cardsController;