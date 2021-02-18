import {Category} from './category';
import {AwardEvent} from './award-event';

export interface Nominee {
  id: string;
  name: string;
  pic: string;
  movie: string;
  link: string;
  category: Category;
  awardEvent: AwardEvent;
  votes: number;
  creationDate: Date;
  status: boolean;
}
