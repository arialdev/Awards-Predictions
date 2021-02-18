import {Category} from './category';

export interface AwardEvent {
  id: string;
  name: string;
  year: number;
  edition: number;
  categories: [Category];
  creationDate: Date;
  status: boolean;
}
