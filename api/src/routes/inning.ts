import express, {Request, Response} from "express";
import { requireAuth } from "../middlewares/require-auth";
import { currentuser } from "../middlewares/current-user";
import { Inning } from "../models/inning";
import matchNamespace from '../messaging/namespace/match-name-space';

const router = express.Router();

router.post('/:inningId/deliveries', currentuser, requireAuth, async (req: Request, res: Response) => {
    const { inningId } = req.params;
    const { roomId, delivery } = req.body;
    const inning = await Inning.findById(inningId).exec();
    const overs = inning?.overs;
    overs?.push(delivery);
    await inning?.save();

    // live score
    const liveScore = await Inning.aggregate(
        [
          {
            '$match': {
              '_id': inning?._id
            }
          },
            {
              '$unwind': {
                'path': '$overs', 
                'includeArrayIndex': 'index', 
                'preserveNullAndEmptyArrays': false
              }
            }, {
              '$match': {
                'overs.isDeleted': {
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
            '$match': {
              '_id': inning?._id
            }
          },
            {
              '$unwind': {
                'path': '$overs', 
                'includeArrayIndex': 'index', 
                'preserveNullAndEmptyArrays': false
              }
            }, {
              '$match': {
                'overs.isDeleted': {
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
            '$match': {
              '_id': inning?._id
            }
          },
            {
              '$unwind': {
                'path': '$overs', 
                'includeArrayIndex': 'index', 
                'preserveNullAndEmptyArrays': false
              }
            }, {
              '$match': {
                'overs.isDeleted': {
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

    //last two overs
    const lastTwoOvers:any = await Inning.aggregate(
        [
            {
              '$match': {
                '_id': inning?._id
              }
            }, {
              '$project': {
                'overs': {
                  '$filter': {
                    'input': '$overs', 
                    'as': 'over', 
                    'cond': {
                        '$and': [
                            {
                                '$or': [
                                    {
                                      '$eq': [
                                        '$$over.over', {
                                          '$add': [
                                            '$currentOver', 1
                                          ]
                                        }
                                      ]
                                    }, {
                                      '$eq': [
                                        '$$over.over', '$currentOver'
                                      ]
                                    }
                                  ]
                            }, {
                                '$eq': [
                                    '$$over.isDeleted', false
                                  ]
                            }
                        ]
                    }
                  }
                }
              }
            }
          ]
    ).exec();

    matchNamespace.getNameSpace().to(roomId).emit("live", {
        type: "live_score",
        liveScore,
        batsmen,
        bowlers,
        currentOver:inning?.currentOver,
        lastOvers: lastTwoOvers && lastTwoOvers.length > 0 ? lastTwoOvers[0].overs: []
    });
    res.status(200).send({
        liveScore,
        batsmen,
        bowlers,
        currentOver:inning?.currentOver,
        lastOvers: lastTwoOvers && lastTwoOvers.length > 0 ? lastTwoOvers[0].overs: []
    });
});

router.get('/:inningId/endover', currentuser, requireAuth, async (req, res) => {
  const { inningId } = req.params;
  const inning = await Inning.findById(inningId).exec();
  let currentOver =inning!.currentOver ? inning!.currentOver: 0;
  currentOver++;
  inning!.currentOver = currentOver;
  await inning?.save();
  res.status(200).send({currentOver: inning?.currentOver});
});

export {router as inningRouter};