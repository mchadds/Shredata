import mongoose from 'mongoose';
import { Document } from 'mongoose';

export default interface ISnowReport extends Document {
    resortName: string;
    updateTime: string;
    values: JSON;
    notes: string;
}
