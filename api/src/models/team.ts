import mongoose from "mongoose";

interface PlayerDoc {
    firstName: string;
    lastName: string
    gender: string;
    isCaptain?: boolean;
    isDeleted?: boolean;
    createdOn?: Date;
    updatedOn?: Date,
}

interface TeamDoc {
    name: string;
    players: PlayerDoc[];
    isDeleted?: boolean;
    createdOn?: Date;
    updatedOn?: Date,
}

const playerSchema = new mongoose.Schema<PlayerDoc>({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true,
    },
    isCaptain: {
        type: Boolean,
        required: true,
        default: false
    },
    isDeleted: {
        type: Boolean,
        required: true,
        default: false
    },
    createdOn: { 
        type: Date, 
        required: true, 
        default: new Date() 
    },
    updatedOn: { 
        type: Date,
        required: true, 
        default: new Date()
    }
});

const teamSchema = new mongoose.Schema<TeamDoc>({
    name: {
        type: String,
        required: true
    },
    players: [playerSchema],
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

const Team = mongoose.model<TeamDoc>('Team', teamSchema);

export { Team };
