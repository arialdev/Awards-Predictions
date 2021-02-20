import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-votes-result',
  templateUrl: './votes-result.component.html',
  styleUrls: ['./votes-result.component.css']
})
export class VotesResultComponent implements OnInit {

  constructor(private userService: UserService, public router: Router) {
  }

  async ngOnInit(): Promise<void> {
    // if (!this.userService.user) {
    //   await this.router.navigate(['voting']);
    // }
  }

}
