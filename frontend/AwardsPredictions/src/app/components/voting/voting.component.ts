import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {AwardEventService} from '../../services/award-event.service';
import {VoteService} from '../../services/vote.service';
import {UserService} from '../../services/user.service';
import {AwardEvent} from '../../interfaces/award-event';
import {SpinnerService} from '../../services/spinner.service';
import {NomineeService} from '../../services/nominee.service';

@Component({
  selector: 'app-voting',
  templateUrl: './voting.component.html',
  styleUrls: ['./voting.component.css']
})
export class VotingComponent implements OnInit {

  awardEvent: AwardEvent;
  votes: number [];
  defaultPic = '/assets/images/no-picture.jpg';
  nomineePictures;
  loadingCounter = 0;

  constructor(
    private awardEventService: AwardEventService,
    private voteService: VoteService,
    private userService: UserService,
    public router: Router,
    public route: ActivatedRoute,
    private nomineeService: NomineeService) {
  }

  async ngOnInit(): Promise<void> {
    if (!this.userService.user) {
      await this.router.navigate(['voting']);
    }

    const awardEventParams = decodeURI(this.router.url).split('/')[2].split('&');
    this.awardEventService.getAwardEventByNameAndEdition(awardEventParams[0], parseInt(awardEventParams[1], 10)).subscribe(
      (award: AwardEvent) => {
        award.categories.forEach((cat, i) => {
          cat.nominees.forEach((nom, j) => {
            this.nomineeService.getNomineePicture(nom._id).subscribe(
              (pic) => {
                this.createImageFromBlob(pic, i, j);
              }
            );
          });
        });
        this.awardEvent = award;
        this.nomineePictures = new Array(award.categories);
        for (let i = 0; i < award.categories.length; i++) {
          this.nomineePictures[i] = new Array(award.categories[i].nominees.length);
        }
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
    SpinnerService.startSpinner('Submitting votes');

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
        const votes = new Array<object>(this.awardEvent.categories.length);
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
        this.router.navigate(['result'], {relativeTo: this.route});
      },
      (err) => {
        console.error(err);
        SpinnerService.stopSpinner();
      }
    );
  }

  getOrdinal(edition: number): string {
    const lastDigit: string = edition.toString().substr(-1, 1);
    switch (lastDigit) {
      case '1':
        return `st`;
      case '2':
        return `nd`;
      case '3':
        return `rd`;
      default:
        return `th`;
    }
  }

  private createImageFromBlob(image: Blob, cat: number, nom: number): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      this.nomineePictures[cat][nom] = reader.result;
      this.loadingCounter++;
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }
}
