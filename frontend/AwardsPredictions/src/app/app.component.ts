import {Component, OnInit} from '@angular/core';
import {SpinnerService} from './services/spinner.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'AwardsPredictions';
  spin = SpinnerService;

  ngOnInit(): void {
    SpinnerService.stopSpinner();
  }
}
