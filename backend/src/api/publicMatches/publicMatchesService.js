const Match = require('../match/match');
const User = require('../user/user');
const dbErrors = require('../common/sendErrorsFromDb');
const { sendErrorsFromDB } = require('../common/sendErrorsFromDb');
const { matches } = require('lodash');
const { mongoose } = require('node-restful/lib/restful');
const match = require('../match/match');
const user = require('../user/user');


const listPublicMatches = async (req, res, next) => {

    await Match.find({ isAPrivateMatch: false }, (err, matches) => {
        if(err) {
            return sendErrorsFromDB(err);
        }
        else if(matches) {
            return res.status(200).json(matches);
        }
        else {
            return res.status(200).json([]);
        }
    })

}

const joinPublicMatch = async (req, res, next) => {
    const userNickname = req.body.userNickname;
    const matchId = req.body.matchId;

    try {
        const user = await User.find({nickname: userNickname});
        const match = await Match.find({_id: matchId});

        if(user.length === 0) {
            return res.status(400).json({errors: ['Usuário não encontrada!']})
        }
    
        if(match.length === 0) {
            return res.status(400).json({errors: ['Partida não encontrada!']})
        }

        await Match.findByIdAndUpdate(
            match[0]._id,
            { $push: { participants: user[0]._id} },
            { new: true, useFindAndModify: false }
        )

        await User.findByIdAndUpdate(
            user[0]._id,
            { $push: { matches: match[0]._id} },
            { new: true, useFindAndModify: false }
        )

    } catch(err) {
        return sendErrorsFromDB(res, err);
    }

    return res.status(200).json({message: 'Sucesso!'})
    
}

module.exports = { listPublicMatches, joinPublicMatch };

