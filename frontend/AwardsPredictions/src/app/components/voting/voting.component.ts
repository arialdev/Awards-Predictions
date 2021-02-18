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

  constructor(private awardEventService: AwardEventService, public router: Router) {

  }

  async ngOnInit(): Promise<void> {
    const awardEventParams = decodeURI(this.router.url).split('/')[2].split('&');
    console.log(awardEventParams);
    this.awardEventService.getAwardEventByNameAndEdition(awardEventParams[0], parseInt(awardEventParams[1], 10)).subscribe(
      (award: AwardEvent) => {
        console.log(award.categories);
        this.awardEvent = award;
      },
      (error) => {
        console.error(error);
      },
    );
    await new Promise(r => setTimeout(r, 2000));
  }

}
