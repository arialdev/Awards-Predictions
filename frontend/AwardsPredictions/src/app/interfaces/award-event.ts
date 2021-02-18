import {Category} from './category';

export interface AwardEvent {
  _id: string;
  name: string;
  year: number;
  edition: number;
  pic: string;
  categories: [Category];
  creationDate: Date;
  status: boolean;
}
