import {Component, OnInit, Output, EventEmitter, OnDestroy} from '@angular/core';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';
import {VoteService} from '../../services/vote.service';
import {SpinnerService} from '../../services/spinner.service';
import {AppComponent} from '../../app.component';

@Component({
  selector: 'app-votes-result',
  templateUrl: './votes-result.component.html',
  styleUrls: ['./votes-result.component.css']
})
export class VotesResultComponent implements OnInit, OnDestroy {

  image: any;
  isImageLoading = true;

  constructor(private appComponent: AppComponent, private userService: UserService, private voteService: VoteService,
              public router: Router) {
  }

  ngOnDestroy(): void {
    this.appComponent.beating = false;
  }

  async ngOnInit(): Promise<void> {
    if (!this.userService.user) {
      SpinnerService.stopSpinner();
      await this.router.navigate(['voting']);
    } else {
      SpinnerService.startSpinner('Rendering...');
      this.getRenderedImage();
    }
  }

  getRenderedImage(): void {
    this.isImageLoading = true;
    this.voteService.createImage(this.voteService.votes).subscribe(
      (pic) => {
        console.log('Correcto');
        this.createImageFromBlob(pic);
        this.isImageLoading = false;
        this.appComponent.beating = true;
      },
      (err) => {
        this.isImageLoading = false;
        console.error(err);
      },
      () => SpinnerService.stopSpinner(),
    );
  }


  private createImageFromBlob(image: Blob): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      SpinnerService.stopSpinner();
      this.image = reader.result;
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }
}
