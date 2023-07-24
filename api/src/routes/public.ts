import express, { Request, Response } from "express";
import { Match } from "../models/match";
import { Inning } from "../models/inning";
import { Global } from "../models/global";
import { Team } from "../models/team";

const router = express.Router();

router.get('/matches', async (req, res) => {
  try {
    const matches = await Match.find({ isDeleted: false }, 'teams status isLive').populate('teams', 'name').exec();
    res.status(200).send(matches);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: 'internal server error' });
  }
});

router.get('/live/:matchId', async (req, res) => {
  try {
    const { matchId } = req.params;
    const matches = await Match.findById(matchId, 'roomId teams toss status firstInning secondInning settings result').populate('teams', 'name').exec();
    res.status(200).send(matches);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: 'internal server error' });
  }
});

router.get('/innings/:inningId', async (req: Request, res: Response) => {
  try {
    const { inningId } = req.params;
    const inning = await Inning.findById(inningId).populate({ path: 'batting', select: ['name'] }).populate({ path: 'bowling', select: ['name'] }).exec();

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
    const lastTwoOvers: any = await Inning.aggregate(
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

    res.status(200).send({
      liveScore,
      batsmen,
      bowlers,
      currentOver: inning?.currentOver,
      lastOvers: lastTwoOvers && lastTwoOvers.length > 0 ? lastTwoOvers[0].overs : [],
      batting: inning?.batting,
      bowling: inning?.bowling,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: 'internal server error' });
  }
});

router.get('/globals', async (req, res) => {
  try {
    const global = await Global.find({ isDeleted: false }, 'roomId matchSetting').exec();
    res.status(200).send(global);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: 'internal server error' });
  }
});

router.get('/teams', async (req: Request, res: Response) => {
  try {
      const teams = await Team.find({ isDeleted: false }).exec();
      res.status(200).send(teams);
  } catch (err) {
      console.log(err);
      res.status(500).send({ message: 'internal server error' });
  }
});

export { router as publicRouter };