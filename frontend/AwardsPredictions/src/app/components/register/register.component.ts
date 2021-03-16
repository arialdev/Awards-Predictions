import {Component, DoCheck, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '../../services/user.service';
import {AwardEventService} from '../../services/award-event.service';
import {User} from '../../interfaces/user';
import {AwardEvent} from '../../interfaces/award-event';
import bootstrap from 'node_modules/bootstrap/dist/js/bootstrap.bundle.js';

import {trigger, state, style, animate, transition} from '@angular/animations';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  animations: [
    trigger('invalidName', [
      state('open', style({
        backgroundColor: '#ff4747',

      })),
      state('closed', style({
        backgroundColor: 'white',
      })),
      transition('open => closed', [
        animate('3s')
      ]),
      transition('closed => open', [
        animate('0.5s')
      ]),
    ]),
  ],
})

export class RegisterComponent implements OnInit {
  public username: string;
  private redirectRoute: string = null;
  failedInput = false;

  constructor(
    private userService: UserService, private awardEventService: AwardEventService,
    private router: Router) {
  }

  ngOnInit(): void {
    // this remains until AwardEventSelection component is created
    this.awardEventService.getAwardEventByNameAndEdition('Oscars', 93).subscribe(
      (award: AwardEvent) => {
        this.redirectRoute = `/voting/${award.name}&${award.edition}`;
      },
      (err) => {
        // redirect to home page
        console.error(err);
        this.redirectRoute = '/';
      }
    );
  }

  onUsernameSubmit(): void {
    if (!this.username) {
      if (!this.failedInput) {
        this.failedInput = true;
      }
      const tooltip = new bootstrap.Tooltip(document.querySelector('input'));
      tooltip.show();
      setTimeout(() => tooltip.hide(), 3000);
    } else {
      this.userService.registerUser(this.username).subscribe(
        (user: User) => {
          this.userService.user = user;
          this.router.navigate([this.redirectRoute]);
        },
        err => console.error(err)
      );
    }
  }

  keyDownFunction(e): void {
    if (e.keyCode === 13) {
      this.onUsernameSubmit();
    }
  }

}
