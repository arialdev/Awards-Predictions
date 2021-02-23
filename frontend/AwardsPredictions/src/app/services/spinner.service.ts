import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  static spinning = false;
  static text = '';

  static stopSpinner(): void {
    SpinnerService.spinning = false;
    SpinnerService.text = '';
  }

  static startSpinner(text = ''): void {
    SpinnerService.spinning = true;
    SpinnerService.text = text;
  }

  constructor() {
  }
}
