import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {AwardEventService} from '../../services/award-event.service';
import {VoteService} from '../../services/vote.service';
import {UserService} from '../../services/user.service';
import {AwardEvent} from '../../interfaces/award-event';

@Component({
  selector: 'app-voting',
  templateUrl: './voting.component.html',
  styleUrls: ['./voting.component.css']
})
export class VotingComponent implements OnInit {

  awardEvent: AwardEvent;
  votes: number [];

  constructor(
    private awardEventService: AwardEventService,
    private voteService: VoteService,
    private userService: UserService,
    public router: Router,
    public route: ActivatedRoute) {
  }

  async ngOnInit(): Promise<void> {
    // if (!this.userService.user) {
    //   await this.router.navigate(['voting']);
    // }

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
      () => {
        const votes = new Array<object>(this.awardEvent.categories.length)
        this.votes.forEach((voteIndex, catIndex) => {
          const vote = {
            awardEvent: {
              name: this.awardEvent.name,
              edition: this.awardEvent.edition,
            },
            category: this.awardEvent.categories[catIndex].name,
            voted: {
              name: this.awardEvent.categories[catIndex].nominees[voteIndex].name,
              movie: this.awardEvent.categories[catIndex].nominees[voteIndex].movie,
              pic: this.awardEvent.categories[catIndex].nominees[voteIndex].pic,
            }
          };
          votes[catIndex] = vote;
        });

        this.voteService.votes = votes;
        console.log(this.voteService.votes);
        this.router.navigate(['result'], {relativeTo: this.route});
      },
      (err) => console.error(err)
    );
  }
}
