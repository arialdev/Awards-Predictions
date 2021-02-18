import {AwardEvent} from './award-event';
import {Category} from './category';
import {Nominee} from './nominee';


export interface User {
  id: string;
  name: string;
  email: string;
  votes: [{
    awardEvent: AwardEvent,
    category: Category,
    voted: Nominee,
  }];
  creationDate: Date;
  status: boolean;
}
