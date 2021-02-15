import {Component, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public username: String;

  constructor(private snackBar: MatSnackBar, private router: Router) {
  }

  ngOnInit(): void {
  }

  onUsernameSubmit() {
    if (!this.username) {
      this.snackBar.open("The username must not me empty!", null, {
        duration: 5000,
        panelClass: ['red-snackbar', 'snackbar']
      });
    } else this.router.navigate(['/voting/GoldenGlobes2021'])
  }
}
