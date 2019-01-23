import {Component, OnInit} from '@angular/core';
import {UserCreate, UsersService} from '../../../../out';
import {ErrorHandlingService} from '../../_services/error-handling.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  // two variables, one for the ngModel, and the other for encrypting the password, and sending it to the backend
  // so that the password input isn't overwritten with the hashed prolonged string

  userPost: UserCreate = {
    email: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    password: ''
  };

  userNgModel: UserCreate = {
    email: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    password: ''
  };

  constructor(
    public router: Router,
    public usersService: UsersService,
    public errHandlingService: ErrorHandlingService) {
  }

  ngOnInit() {
  }

  onSubmit() {
    this.userPost = Object.assign({}, this.userNgModel);
    const sha512 = require('js-sha512');
    const hash = sha512.create();
    hash.update(this.userPost.password);
    this.userPost.password = hash.hex();
    console.log(this.userPost);
    this.usersService.postUsersCollection(this.userPost).subscribe((res) => {
      this.router.navigateByUrl('login');
    }, err => {
      this.errHandlingService.handleError(err);
    });
  }
}
