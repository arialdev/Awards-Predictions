import {Category} from './category';
import {AwardEvent} from './award-event';

export interface Nominee {
  _id: string;
  name: string;
  pic: string | ArrayBuffer;
  movie: string;
  link: string;
  category: Category;
  awardEvent: AwardEvent;
  votes: number;
  creationDate: Date;
  status: boolean;
}
