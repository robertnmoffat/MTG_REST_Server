const { Model } = require('mongoose');
import { Request, Response } from "express";
import { Card } from "models/Card";
import { setNames } from "../data/supportedSets";
import { cardCounts } from "../data/cardCounts";
import { cardFieldSelection } from "../data/cardFieldSelection";


type ReqParams = { set: string, start: string };
type ReqQuery = { query: { set: string } };//Defining so that req.query can be referenced


/**
 * Handles all pack generation. Returns a randomized pack for the specified set.
 * @param CardModel Model representing database card entries
 * @returns Functions handling pack requests
 */
function packController(CardModel: typeof Model) {


    /**
     * Generates a randomized pack for the set specified in the request parameter 'set'
     * @param req HTTP requese
     * @param res HTTP response
     * @returns void
     */
    async function getPackWithSet(req: Request<ReqParams>, res: Response) {
        let position = -1;
        const setReq = String(req.params.set);
        let pack: Card[] = [];
        const mythic = Math.floor(Math.random() * 8) == 1;//Do a random 1 in 8 chance of opening a mythic
        let pick: number; //Randomized number represending which card to pick

        //Search for the requested set and save it's index for referencing the card counts array
        const elementFound = setNames.find((element, index) => {
            position = index;
            return element === setReq;
        })

        //If the set was not found, return error
        if (!elementFound) {
            handleIncorrectPackRoute(req, res);
            return;
        }

        let time: number = 0.0;
        if (process.env.TEST == 'true')
            time = performance.now();

        //Grab each card randomly to create a pack
        //1 mythic or rare, 3 uncommon, 10 common
        if (mythic) {
            pick = Math.floor(Math.random() * Number(cardCounts[position].mythic));
            await CardModel.findOne({ set: setReq, rarity: 'mythic' }, cardFieldSelection).skip(pick).lean().then((card: Card) => pack.push(card))
                .catch((err: Error) => console.log(`DB error: ${err}`));
        } else {
            pick = Math.floor(Math.random() * Number(cardCounts[position].rare));
            await CardModel.findOne({ set: setReq, rarity: 'rare' }, cardFieldSelection).skip(pick).lean().then((card: Card) => pack.push(card))
                .catch((err: Error) => console.log(`DB error: ${err}`));
        }
        for (let i = 0; i < 3; i++) {
            pick = Math.floor(Math.random() * Number(cardCounts[position].uncommon));
            await CardModel.findOne({ set: setReq, rarity: 'uncommon' }, cardFieldSelection).skip(pick).lean().then((card: Card) => pack.push(card))
                .catch((err: Error) => console.log(`DB error: ${err}`));
        }
        for (let i = 0; i < 10; i++) {
            pick = Math.floor(Math.random() * Number(cardCounts[position].common));
            await CardModel.findOne({ set: setReq, rarity: 'common' }, cardFieldSelection).skip(pick).lean().then((card: Card) => pack.push(card))
                .catch((err: Error) => console.log(`DB error: ${err}`));
        }


        let elapsed: number;
        if (process.env.TEST == 'true') {
            elapsed = performance.now() - time;
            console.log(`Pack fetch completed in ${elapsed} milliseconds.`)
        }

        res.send(pack);
    }

    /**
     * Notifies user of incorrectly entered routes and lists valid sets
     * @param req HTTP request
     * @param res HTTP response
     */
    function handleIncorrectPackRoute(req: Request<ReqParams>, res: Response) {
        res.status(400).send(`Incorrect pack route. Should be /api/packs/"set"\nThe following sets are supported: ${setNames.map((set) => `\n${set}`)}`);
    }

    return { getPackWithSet, handleIncorrectPackRoute };
}

module.exports = packController;