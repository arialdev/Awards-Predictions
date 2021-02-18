import {Component, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
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

  constructor(
    private userService: UserService, private awardEventService: AwardEventService, private snackBar: MatSnackBar,
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
      this.snackBar.open('The username must not me empty!', null, {
        duration: 5000,
        panelClass: ['red-snackbar', 'snackbar']
      });
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
