import mongoose, { Schema } from "mongoose";

interface Toss {
    name: string;
    id: string;
    isBatFirst: boolean;
}
interface MatchDoc {
    roomId: string;
    teams: any[];
    toss?: Toss;
    firstInning?: any;
    secondInning?: any;
    status: string;
    result?: string;
    isLive?: boolean;
    isDeleted?: boolean;
    createdOn?: Date;
    updatedOn?: Date,
}

const matchSchema = new mongoose.Schema<MatchDoc>({
    roomId: {
        type: String,
        required: true
    },
    teams: [
        { 
            type: Schema.Types.ObjectId,
            ref: 'Team',
        }
    ],
    toss: {
       name: {
        type: String,
       },
       id: {
        type: String,
       },
       isBatFirst: {
        type: Boolean
       }
    },
    firstInning: {
        type: Schema.Types.ObjectId,
        ref: 'Inning',
    },
    secondInning: {
        type: Schema.Types.ObjectId,
        ref: 'Inning',
    },
    status: {
        type: String,
        required: true,
    },
    result: {
        type: String,
    },
    isDeleted: {
        type: Boolean,
        required: true,
        default: false
    },
    isLive: {
        type: Boolean,
        required: true,
        default: false
    },
    createdOn: { 
        type: Date, required: true, 
        default: new Date() 
    },
    updatedOn: { 
        type: Date, required: true, 
        default: new Date()
    }
});

const Match = mongoose.model<MatchDoc>('Match', matchSchema);

export { Match };
