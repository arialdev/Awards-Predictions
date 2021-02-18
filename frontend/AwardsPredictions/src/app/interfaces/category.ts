import {Nominee} from './nominee';
import {AwardEvent} from './award-event';

export interface Category {
  _id: string;
  name: string;
  nominees: [Nominee];
  winner: Nominee;
  awardEvent: AwardEvent;
  creationDate: Date;
  status: boolean;
}
