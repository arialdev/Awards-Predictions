import {Component, Input, OnInit} from '@angular/core';
import {SpinnerService} from './services/spinner.service';
import {trigger, state, style, animate, transition} from '@angular/animations';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('beat', [
      state('big', style({
        transform: 'scale(1.2)',
      })),
      state('small', style({
        transform: 'scale(0.75)',
      })),
      transition('* <=> *', [
        animate(500)
      ])
    ]),
  ]
})
export class AppComponent implements OnInit {
  title = 'AwardsPredictions';
  spin = SpinnerService;

  beating;
  state = 'small';

  ngOnInit(): void {
    SpinnerService.stopSpinner();
    this.beating = false;
  }

  onLoop(): void {
    this.state = this.state === 'big' ? 'small' : 'big';
  }
}
