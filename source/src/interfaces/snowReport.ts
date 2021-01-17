import mongoose, { Document } from 'mongoose';

export default interface ISnowReport extends Document {
    resortName: string;
    updateTime: string;
    values: JSON;
    notes: string;
}
