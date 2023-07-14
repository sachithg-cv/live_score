import mongoose from "mongoose";
import { Global } from "../models/global";

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
}