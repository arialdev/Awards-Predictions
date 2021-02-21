import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';
import {VoteService} from "../../services/vote.service";

@Component({
  selector: 'app-votes-result',
  templateUrl: './votes-result.component.html',
  styleUrls: ['./votes-result.component.css']
})
export class VotesResultComponent implements OnInit {

  image: any;
  isImageLoading = true;

  constructor(private userService: UserService, private voteService: VoteService, public router: Router) {
  }

  async ngOnInit(): Promise<void> {
    // if (!this.userService.user) {
    //   await this.router.navigate(['voting']);
    // }
    this.getRenderedImage();

  }

  getRenderedImage() {
    this.isImageLoading = true;
    this.voteService.createImage(this.voteService.votes).subscribe(
      (pic) => {
        console.log('Correcto');
        this.createImageFromBlob(pic);
        this.isImageLoading = false;

      },
      (err) => {
        if (err.url) {
          this.image = err.url;
        }
        this.isImageLoading = false;
        console.error(err);
      },
    );
  }


  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      this.image = reader.result;
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }


}
