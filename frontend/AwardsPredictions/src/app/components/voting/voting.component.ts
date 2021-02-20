import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AwardEventService} from '../../services/award-event.service';
import {VoteService} from '../../services/vote.service';
import {AwardEvent} from '../../interfaces/award-event';

@Component({
  selector: 'app-voting',
  templateUrl: './voting.component.html',
  styleUrls: ['./voting.component.css']
})
export class VotingComponent implements OnInit {

  awardEvent: AwardEvent;
  votes: number [];

  constructor(private awardEventService: AwardEventService, private voteService: VoteService, public router: Router) {

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
    const nominees = [];
    this.votes.forEach((voteIndex, catIndex) => {
      const vote = {
        category: this.awardEvent.categories[catIndex]._id,
        voted: this.awardEvent.categories[catIndex].nominees[voteIndex]._id
      };
      nominees.push(vote);
    });

    this.voteService.sendVotes(this.awardEvent._id, nominees).subscribe(
      (res) => {
        this.router.navigate(['/']);
      },
      (err) => console.error(err)
    );
  }

}
