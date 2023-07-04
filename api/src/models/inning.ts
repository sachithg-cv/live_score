import mongoose, { Schema } from "mongoose";

interface InningDoc {
    batting: any;
    bowling: any;
    overs: OverDoc[];
    isDeleted?: boolean;
    createdOn?: Date;
    updatedOn?: Date,
}

interface OverDoc {
    over: number;
    batsmanId: number;
    batsmanName: string;
    bowlerId: number;
    bowlerName: string;
    runs: number;
    isLegal: boolean;
    isWicket: boolean;
    extraRuns?: number;
    extraType?: string;
    isDeleted?: boolean;
    createdOn?: Date;
    updatedOn?: Date,
}

const overSchema = new mongoose.Schema<OverDoc>({
    over: {
        type: Number,
        required: true,
    },
    batsmanId: {
        type: Number,
        required: true,
    },
    batsmanName: {
        type: String,
        required: true,
    },
    bowlerId: {
        type: Number,
        required: true,
    },
    bowlerName: {
        type: String,
        required: true,
    },
    runs: {
        type: Number,
        required: true,
    },
    isLegal: {
        type: Boolean,
        required: true,
        default: true
    },
    isWicket: {
        type: Boolean,
        required: true,
        default: true
    },
    extraRuns: {
        type: Number,
        required: false,
        default: 0
    },
    extraType: {
        type: String,
        required: false,
        default: "None"
    },
    isDeleted: {
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

const inningSchema = new mongoose.Schema<InningDoc>({
    batting: {
        type: Schema.Types.ObjectId,
        ref: 'Team',
    },
    bowling:
    { 
        type: Schema.Types.ObjectId,
        ref: 'Team',
    },
    overs: [overSchema],
    isDeleted: {
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

const Inning = mongoose.model<InningDoc>('Inning', inningSchema);

export { Inning };
