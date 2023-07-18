import mongoose, { Schema } from "mongoose";

export interface MatchSettingDoc {
    wide: number;
    noBall: number;
    isIllegalDeliveryDiscarded: boolean;
    ballsPerOver: number;
}
interface GlobalDoc {
    roomId: string;
    matchSetting: MatchSettingDoc
    isDeleted?: boolean;
    createdOn?: Date;
    updatedOn?: Date,
}

const matchSettingSchema = new mongoose.Schema<MatchSettingDoc>({
    wide: {
        type: Number,
        required: true,
        default: 4
    },
    noBall: {
        type: Number,
        required: true,
        default: 6
    },
    isIllegalDeliveryDiscarded: {
        type: Boolean,
        required: true,
        default: true
    },
    ballsPerOver: {
        type: Number,
        required: true,
        default: 6
    }
});

const globalSchema = new mongoose.Schema<GlobalDoc>({
    roomId: {
        type: String,
        required: true
    },
    matchSetting: matchSettingSchema,
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

const Global = mongoose.model<GlobalDoc>('Global', globalSchema);

export { Global };
