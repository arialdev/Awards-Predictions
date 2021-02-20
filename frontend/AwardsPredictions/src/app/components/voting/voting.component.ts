import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AwardEventService} from '../../services/award-event.service';
import {AwardEvent} from '../../interfaces/award-event';

@Component({
  selector: 'app-voting',
  templateUrl: './voting.component.html',
  styleUrls: ['./voting.component.css']
})
export class VotingComponent implements OnInit {

  awardEvent: AwardEvent = null;
  votes: number [];

  constructor(private awardEventService: AwardEventService, public router: Router) {

  }

  async ngOnInit(): Promise<void> {
    const awardEventParams = decodeURI(this.router.url).split('/')[2].split('&');
    this.awardEventService.getAwardEventByNameAndEdition(awardEventParams[0], parseInt(awardEventParams[1], 10)).subscribe(
      (award: AwardEvent) => {
        this.awardEvent = award;
        this.votes = new Array<number>(award.categories.length);
      },
      (error) => {
        console.error(error);
      },
    );
    await new Promise(r => setTimeout(r, 2000));
  }

  onNomineeSelected(categoryIndex: number, nomineeIndex: number): void {
    this.votes[categoryIndex] = nomineeIndex;
  }

  async submitVotes(): Promise<void> {
    console.log(this.votes);

    this.votes.forEach(vote => {

    });
  }


}
