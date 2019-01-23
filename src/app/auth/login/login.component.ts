import {AuthenticationService} from '../../_services/authentication.service';
import {Login, UserCreate, UserRead} from '../../../../out';
import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  userPost: UserCreate = {
    email: '',
    first_name: '',
    middle_name: '',
    last_name: ''
  };
  user: UserRead = {
    email: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    id: ''
  };
  login: Login = {
    email: '',
    password: ''
  };
  @ViewChild('f') form;
  returnUrl: string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              public auth: AuthenticationService) {
  }

  ngOnInit() {
  }

  onSubmit() {
    const sha512 = require('js-sha512');
    const hash = sha512.create();
    this.login.password = this.userPost.password;
    hash.update(this.login.password);
    this.login.password = hash.hex();
    this.login.email = this.userPost.email;
    this.auth.login(this.login);
  }

  checkTime() {
    return this.auth.time_remaining > 0;
  }
}
