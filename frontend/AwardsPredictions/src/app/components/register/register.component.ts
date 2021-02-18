import {Component, DoCheck, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '../../services/user.service';
import {AwardEventService} from '../../services/award-event.service';
import {User} from '../../interfaces/user';
import {AwardEvent} from '../../interfaces/award-event';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
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
    this.awardEventService.getAwardEventByNameAndEdition('Golden Globes', 78).subscribe(
      (award: AwardEvent) => {
        this.redirectRoute = `/voting/${award._id}`;
      },
      (err) => {
        // redirigir a otro lado
        console.error(err);
        this.redirectRoute = '/';
      }
    );
  }

  onUsernameSubmit(): void {
    if (!this.username) {
      this.failedInput = true;
      let input = document.querySelector('input') as HTMLElement;
      input.classList.add()

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
}
