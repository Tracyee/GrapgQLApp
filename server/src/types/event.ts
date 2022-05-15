import { Document } from 'mongoose';

export default interface IEvent extends Document {
  title: string;
  description: string;
  price: number;
  date: string;
}
