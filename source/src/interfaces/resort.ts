import { Document } from 'mongoose';

export default interface IResort extends Document {
    name: string;
    province: string;
    latitude: string;
    longitude: string;
    extraInformation: string;
}
