import express, {Request, Response} from "express";
import { requireAuth } from "../middlewares/require-auth";
import { currentuser } from "../middlewares/current-user";
import { Inning } from "../models/inning";
import matchNamespace from '../messaging/namespace/match-name-space';

const router = express.Router();

router.post('/:inningId/deliveries', currentuser, requireAuth, async (req: Request, res: Response) => {
    const { inningId } = req.params;
    const inning = await Inning.findById(inningId).exec();
    const overs = inning?.overs;
    overs?.push({
        batsmanId:'64a460f1763ffebe1472dfac',
        batsmanName: 'Michell Marsh',
        bowlerId: '64a460f1763ffebe1472dfad',
        bowlerName: 'Steve Smith',
        isLegal: true,
        isWicket: false,
        over: 2,
        runs: 6,
    });
    await inning?.save();

    // live score
    const liveScore = await Inning.aggregate(
        [
            {
              '$unwind': {
                'path': '$overs', 
                'includeArrayIndex': 'index', 
                'preserveNullAndEmptyArrays': false
              }
            }, {
              '$match': {
                'isDeleted': {
                  '$eq': false
                }
              }
            }, {
              '$project': {
                'overs.runs': 1, 
                'overs.extraRuns': 1, 
                'wickets': {
                  '$cond': {
                    'if': {
                      '$eq': [
                        '$overs.isWicket', true
                      ]
                    }, 
                    'then': 1, 
                    'else': 0
                  }
                }, 
                'legal': {
                  '$cond': {
                    'if': {
                      '$eq': [
                        '$overs.isLegal', true
                      ]
                    }, 
                    'then': 1, 
                    'else': 0
                  }
                }
              }
            }, {
              '$group': {
                '_id': null, 
                'runs': {
                  '$sum': '$overs.runs'
                }, 
                'extras': {
                  '$sum': '$overs.extraRuns'
                }, 
                'wickets': {
                  '$sum': '$wickets'
                }, 
                'balls': {
                  '$sum': '$legal'
                }
              }
            }
          ]
    ).exec();
        
    // batsman
    const batsmen = await Inning.aggregate(
        [
            {
              '$unwind': {
                'path': '$overs', 
                'includeArrayIndex': 'index', 
                'preserveNullAndEmptyArrays': false
              }
            }, {
              '$match': {
                'isDeleted': {
                  '$eq': false
                }
              }
            }, {
              '$sort': {
                'createdOn': 1
              }
            }, {
              '$project': {
                'overs.runs': 1, 
                'overs.batsmanId': 1, 
                'overs.batsmanName': 1, 
                'isOut': {
                  '$cond': {
                    'if': {
                      '$eq': [
                        '$overs.isWicket', true
                      ]
                    }, 
                    'then': 1, 
                    'else': 0
                  }
                }, 
                'legal': {
                  '$cond': {
                    'if': {
                      '$eq': [
                        '$overs.isLegal', true
                      ]
                    }, 
                    'then': 1, 
                    'else': 0
                  }
                }
              }
            }, {
              '$group': {
                '_id': [
                  '$overs.batsmanId', '$overs.batsmanName'
                ], 
                'runs': {
                  '$sum': '$overs.runs'
                }, 
                'isOut': {
                  '$sum': '$isOut'
                }, 
                'balls': {
                  '$sum': '$legal'
                }
              }
            }
          ]
    ).exec();
        
    // bowlers
    const bowlers = await Inning.aggregate(
        [
            {
              '$unwind': {
                'path': '$overs', 
                'includeArrayIndex': 'index', 
                'preserveNullAndEmptyArrays': false
              }
            }, {
              '$match': {
                'isDeleted': {
                  '$eq': false
                }
              }
            }, {
              '$sort': {
                'createdOn': 1
              }
            }, {
              '$project': {
                'overs.runs': 1, 
                'overs.extraRuns': 1, 
                'overs.bowlerId': 1, 
                'overs.bowlerName': 1, 
                'wicket': {
                  '$cond': {
                    'if': {
                      '$eq': [
                        '$overs.isWicket', true
                      ]
                    }, 
                    'then': 1, 
                    'else': 0
                  }
                }, 
                'legal': {
                  '$cond': {
                    'if': {
                      '$eq': [
                        '$overs.isLegal', true
                      ]
                    }, 
                    'then': 1, 
                    'else': 0
                  }
                }
              }
            }, {
              '$group': {
                '_id': [
                  '$overs.bowlerId', '$overs.bowlerName'
                ], 
                'runs': {
                  '$sum': '$overs.runs'
                }, 
                'wickets': {
                  '$sum': '$wicket'
                }, 
                'balls': {
                  '$sum': '$legal'
                }, 
                'extras': {
                  '$sum': '$overs.extraRuns'
                }
              }
            }
          ]
    ).exec();

    matchNamespace.getNameSpace().to('12345').emit("live", {liveScore, batsmen, bowlers});
    res.status(200).send({liveScore, batsmen, bowlers});
});

export {router as inningRouter};