import mongoose from "mongoose";
import { Global } from "../models/global";
import { Match } from "../models/match";
import { Inning } from "../models/inning";
import { Team } from "../models/team";

export const runScripts = async () => {
    let collections = await mongoose.connection.db.listCollections().toArray();
    let filteredCollections = collections.filter((col)=> col.name === "globals");
    if (filteredCollections && filteredCollections.length === 0) {
        const global = new Global({
            roomId:new mongoose.Types.ObjectId().toHexString(),
            matchSetting: {}
        });
        await global.save();
    }

    try{
        await Match.deleteMany({});
        await Inning.deleteMany({});
    } catch (err) {
        console.error(err);
    }

    try {
        await Team.deleteMany({});

        const otl = new Team({
            name: "Over The Line",
            players: [
                {
                    firstName:"R",
                    lastName: "Wijesinghe",
                    gender:"Male",
                },
                {
                    firstName:"A",
                    lastName: "Wijesinghe",
                    gender:"Female",
                },
                {
                    firstName:"P",
                    lastName: "Liyanathanthri",
                    gender:"Male",
                },
                {
                    firstName:"N",
                    lastName: "Kodithuwakku",
                    gender:"Male",
                },
                {
                    firstName:"B",
                    lastName: "Undupitiya",
                    gender:"Male",
                },
                {
                    firstName:"S",
                    lastName: "Gunasekara",
                    gender:"Male",
                },
                {
                    firstName:"Y",
                    lastName: "Perera",
                    gender:"Male",
                }
            ]
        });
        await otl.save();

        const cgu = new Team({
            name: "Cashew Garden",
            players: [
                {
                    firstName:"A",
                    lastName: "Weeraman",
                    gender:"Male",
                },
                {
                    firstName:"M",
                    lastName: "Dissanayake",
                    gender:"Male",
                },
                {
                    firstName:"H",
                    lastName: "Bombuwala",
                    gender:"Male",
                },
                {
                    firstName:"A",
                    lastName: "Chathuranga",
                    gender:"Male",
                },
                {
                    firstName:"Z",
                    lastName: "Ahmed",
                    gender:"Male",
                },
                {
                    firstName:"A",
                    lastName: "Mendis",
                    gender:"Female",
                },
                {
                    firstName:"T",
                    lastName: "Kumara",
                    gender:"Male",
                }
            ]
        });
        await cgu.save();

        const sb = new Team({
            name: "Somi Boys",
            players: [
                {
                    firstName:"S",
                    lastName: "Shehan",
                    gender:"Male",
                },
                {
                    firstName:"E",
                    lastName: "Rajapakshe",
                    gender:"Male",
                },
                {
                    firstName:"C",
                    lastName: "Walisinghe",
                    gender:"Male",
                },
                {
                    firstName:"S",
                    lastName: "Mowlana",
                    gender:"Male",
                },
                {
                    firstName:"U",
                    lastName: "Peiris",
                    gender:"Male",
                },
                {
                    firstName:"R",
                    lastName: "Jiffry",
                    gender:"Female",
                },
                {
                    firstName:"I",
                    lastName: "Madumadawa",
                    gender:"Male",
                }
            ]
        });
        await sb.save();

        const dd = new Team({
            name: "Dazzling Dragons",
            players: [
                {
                    firstName:"N",
                    lastName: "Janarthanarajah",
                    gender:"Male",
                },
                {
                    firstName:"A",
                    lastName: "Ragunathan",
                    gender:"Male",
                },
                {
                    firstName:"L",
                    lastName: "Wijesinghe",
                    gender:"Male",
                },
                {
                    firstName:"M",
                    lastName: "Sonnadara",
                    gender:"Male",
                },
                {
                    firstName:"P",
                    lastName: "De Silva",
                    gender:"Male",
                },
                {
                    firstName:"V",
                    lastName: " Samarawickrama",
                    gender:"Female",
                }
            ]
        });
        await dd.save();

        const aa = new Team({
            name: "API Avengers",
            players: [
                {
                    firstName:"R",
                    lastName: " Sanjayamal",
                    gender:"Male",
                },
                {
                    firstName:"S",
                    lastName: "Nazeer",
                    gender:"Male",
                },
                {
                    firstName:"M",
                    lastName: "Chowdhury",
                    gender:"Male",
                },
                {
                    firstName:"P",
                    lastName: "Nirmal",
                    gender:"Male",
                },
                {
                    firstName:"C",
                    lastName: "Vimukthi",
                    gender:"Male",
                },
                {
                    firstName:"S",
                    lastName: "Ameen",
                    gender:"Female",
                }
            ]
        });
        await aa.save();

        const pf = new Team({
            name: "Phoenix Flames",
            players: [
                {
                    firstName:"Z",
                    lastName: " Jurangpathy",
                    gender:"Male",
                },
                {
                    firstName:"M",
                    lastName: "Abdurrahman",
                    gender:"Male",
                },
                {
                    firstName:"J",
                    lastName: "Sarwapriya",
                    gender:"Male",
                },
                {
                    firstName:"I",
                    lastName: "Perera",
                    gender:"Male",
                },
                {
                    firstName:"T",
                    lastName: "Sandaru",
                    gender:"Male",
                },
                {
                    firstName:"D",
                    lastName: "Dissanayake",
                    gender:"Female",
                }
            ]
        });
        await pf.save();

    } catch (err) {
        console.log(err);
    }
    
}