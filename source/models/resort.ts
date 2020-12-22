import mongoose, { Schema } from 'mongoose';
import IResort from '../interfaces/resort';

const ResortSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        province: { type: String, required: true },
        latitude: { type: String, required: true },
        longitude: { type: String, required: true },
        extraInformation: { type: String, required: false }
    },
    {
        // automatically creates a created date and updated date for the document
        timestamps: true
    }
);

// Mongoose allows you to make functions on action for example on save
// this function writes to the extraInformation column after the document has been written to the collection
ResortSchema.post<IResort>('save', function () {
    this.extraInformation = 'THis is some extra info we want to put onto this entry after the save';
});

// exporting model so it can be used in our restful api
// Pass in IResort so that any time we use a mongoose function it will give us access to all of our variables
export default mongoose.model<IResort>('Resort', ResortSchema);
