import mongoose, { Schema } from 'mongoose';
import ISnowReport from '../interfaces/snowReport';

const SnowReportSchema: Schema = new Schema(
    {
        //resort_id: { type: mongoose.Types.ObjectId },
        resortName: { type: String, required: true },
        updateTime: { type: String, required: true },
        values: { type: JSON, required: false },
        notes: { type: String, required: false }
    },
    {
        // automatically creates a created date and updated date for the document
        timestamps: true
    }
);
//SnowReportSchema.index({ resortName: 1, updateTime: 1 }, { unique: true, name: 'myUniqueIndex' });

// Mongoose allows you to make functions on action for example on save
// this function writes to the extraInformation column after the document has been written to the collection
//ResortSchema.post<IResort>('save', function () {
//   this.extraInformation = 'THis is some extra info we want to put onto this entry after the save';
//});

// exporting model so it can be used in our restful api
// Pass in IResort so that any time we use a mongoose function it will give us access to all of our variables
export default mongoose.model<ISnowReport>('SnowReport', SnowReportSchema);
