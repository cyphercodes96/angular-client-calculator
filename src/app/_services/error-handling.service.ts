import {AuthenticationService} from './authentication.service';
import {ErrorHandler, Injectable} from '@angular/core';
import {LoaderService} from './loader.service';
import swal from 'sweetalert';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlingService implements ErrorHandler {

  ErrorMessages = [
    {title: 'Bad Request', message: 'The request you sent to the server is corrupted.'},
    {title: 'Not Found', message: 'The requested resource could not be found.\nPlease try again later.'},
    {title: 'Conflict', message: 'The request could not be processed because of conflict in the request.'},
    {title: 'Bad Request', message: 'The file could not be uploaded because of file size exceeding limitation.'},
    {title: 'Server Error', message: 'There was an error on the server.\nPlease try again later.'}
  ];

  constructor(private auth: AuthenticationService,
              private loaderService: LoaderService) {
  }

  handleError(error, location?) {
    console.log(error);
    console.log(location);
    this.loaderService.hide();
    switch (error.status) {
      case
      400: {
        swal(this.ErrorMessages[0].title, this.ErrorMessages[0].message, 'error');
        break;
      }
      case
      401: {
        if ((error.statusText === 'UNAUTHORIZED' || error.statusText === 'Unauthorized' || error.message === 'Token has expired' ||
          error.error.msg === 'Token has expired') && error.status === 401 && !this.auth.silentActive) {
          swal('Note', 'Your Session has expired, automatic renewal triggered, Page will be reloaded', 'success');
          this.auth.silentLoginF({email: this.auth.getEmail(), password: this.auth.getPass()}).then((access_token) => {
            return 'Bearer ' + access_token;
          });
          break;
        }
        break;
      }
      case
      404: {
        swal(this.ErrorMessages[1].title, this.ErrorMessages[1].message, 'error');
        break;
      }
      case
      409: {
        swal(this.ErrorMessages[2].title, this.ErrorMessages[2].message, 'error');
        break;
      }
      case
      413: {
        swal(this.ErrorMessages[3].title, this.ErrorMessages[3].message, 'error');
        break;
      }
      case
      500: {
        swal(this.ErrorMessages[4].title, this.ErrorMessages[4].message, 'error');
        break;
      }
      default: {
        swal('Error', 'Oops, Something wrong occurred \n' +
          'Please Try Again Later, if failed \n' +
          'Kindly contact system administrators and report issue', 'error');
        break;
      }
    }
  }
}
