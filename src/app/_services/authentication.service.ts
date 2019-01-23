import {Configuration, ConfigurationParameters, Login, LoginService, OperationsService, Token, UsersService} from '../../../out';
import {CookieService} from 'ngx-cookie-service';
import {HttpClient} from '@angular/common/http';
import {LoaderService} from './loader.service';
import {DomainService} from './domain.service';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';


@Injectable()
export class AuthenticationService {

  time_remaining = 0;
  token: Token = {
    access_token: '',
    id: ''
  };
  configParam: ConfigurationParameters = {
    apiKeys: {['Authorization']: ''},
    username: '',
    accessToken: '',
    password: '',
    basePath: ''
  };
  configuration: Configuration;
  currentUser: { key: string };
  silentActive = false;
  isLoggingOut = false;
  block = false;

  constructor(private http: HttpClient,
              private loginService: LoginService,
              private usersService: UsersService,
              private operationsService: OperationsService,
              private router: Router,
              private loader: LoaderService,
              private subDomainService: DomainService,
              private cookieService: CookieService) {
    this.resetCurrentUser();
  }

  login(login: Login) {
    this.loader.show();
    this.tokenConfiguration(login);
  }

  tokenConfiguration(login: Login) {
    return this.loginService.postAuthentication(login)
      .subscribe((res) => {
        if (res && res.access_token) {
          this.currentUser.key = res.access_token;
          this.setCookiesAndConfig(res, login).then(() => {
            this.router.navigateByUrl('/calculator');
            this.loader.hide();
          });
        }
      }, err => {
        this.loader.hide();
        if (err.error.time_remaining) {
          this.time_remaining = err.error.time_remaining;
          swal('Login Failed', 'Too many failed attempts, please try again later.', 'error');
          if (this.time_remaining > 0) {
            const interval = setInterval(() => {
              this.block = true;
              if (this.time_remaining <= 0) {
                this.block = false;
                clearTimeout(interval);
              } else {
                this.time_remaining--;
              }
            }, 1000);
          }
        } else {
          swal('Login Failed', 'Please check E-mail and Password', 'error');
        }
      });
  }

  // method called when starting the frontend
  // retrieves the clinicId and sets up the local storage
  clinicConfiguration() {
    return new Promise((resolve, reject) => {
      this.currentUser.key = this.getToken();
      this.setConfiguration();
      this.loader.hide();
      resolve();
    });
  }

  getToken() {
    if (this.isLoggedIn()) {
      return 'Bearer ' + this.getJWTFromCookies();
    } else {
      this.logout();
      return '';
    }
  }

  refreshToken() {
    return new Promise((resolve, reject) => {
      if (!this.silentActive) {
        this.silentActive = true;
        let local_exp;
        let token;
        let decoded;
        let token_lifetime;
        let servertime_delta;
        const jwtDecode = require('jwt-decode');
        if (localStorage.getItem('local_exp')) {
          local_exp = localStorage.getItem('local_exp');
        } else {
          token = this.getJWTFromCookies();
          decoded = jwtDecode(token);
          token_lifetime = decoded.exp - decoded.iat;
          servertime_delta = Math.round(Date.now() / 1000) - decoded.iat;
          local_exp = decoded.iat + servertime_delta + token_lifetime - 120;
          localStorage.setItem('local_exp', JSON.stringify(local_exp));
        }
        if (Math.round(Date.now() / 1000) > local_exp) {
          this.silentLoginF({email: this.getEmail(), password: this.getPass()}).then((access_token) => {
            decoded = jwtDecode(access_token);
            token_lifetime = decoded.exp - decoded.iat;
            servertime_delta = Math.round(Date.now() / 1000) - decoded.iat;
            local_exp = decoded.iat + servertime_delta + token_lifetime - 120;
            localStorage.removeItem('local_exp');
            localStorage.setItem('local_exp', JSON.stringify(local_exp));
            this.silentActive = false;
            resolve();
            return 'Bearer ' + access_token;
          });
        } else {
          this.silentActive = false;
          resolve();
        }
      } else {
        const interval = setInterval(() => {
          if (!this.silentActive) {
            clearInterval(interval);
            resolve();
          }
        }, 2000);
      }
    });
  }

  silentLoginF(login: Login) {
    return new Promise(((resolve, reject) => {
      this.loader.show();
      this.silentActive = true;
      this.loginService.postAuthentication(login)
        .subscribe((res) => {
          // login successful if there's a jwt token in the response
          if (res && res.access_token) {
            this.setCookiesAndConfig(res, login).then(() => {
              this.loader.hide();
              this.silentActive = false;
              resolve(res.access_token);
              setTimeout(() => window.location.reload(), 3000);
            });
          }
        }, err => {
          this.loader.hide();
          this.silentActive = false;
          reject();
          swal('SilentLogin Failed!', 'PLease re-login manually!', 'error');
          this.logout();
        });
    }));
  }

  isLoggedIn() {
    return this.cookieService.check('currentUser_id');
  }

  resetCurrentUser() {
    this.currentUser = {key: ''};
  }

  logout() {
    this.isLoggingOut = true;
    this.loader.hide();
    // deletes profilePictureId of user from localStorage
    const users = this.getUsersLocalStorage();
    const user = users[this.getId()];
    if (user) {
      user.role = null;
      user.profilePictureId = null;
      users[this.getId()] = user;
      localStorage.setItem('users', JSON.stringify(users));
    }
    this.resetCurrentUser();
    this.subDomainService.getDomainNameForCookie().then((cookieDomain) => {
      this.cookieService.delete('currentUser_id', '/', '.' + cookieDomain.toString());
      this.cookieService.deleteAll('/', '.' + cookieDomain.toString());
      this.isLoggingOut = false;
      this.router.navigateByUrl('/login');
    });
  }

  getId() {
    if (this.isLoggedIn()) {
      return this.cookieService.get('currentUser_id');
    }
  }

  getJWTFromCookies() {
    return this.cookieService.get('currentUser_token');
  }

  getEmail() {
    if (this.isLoggedIn()) {
      return this.cookieService.get('currentUser_email');
    }
  }

  getPass() {
    if (this.isLoggedIn()) {
      return this.cookieService.get('currentUser_pass');
    }
  }

  removeUserFromLocalStorage(user_id) {
    const users = this.getUsersLocalStorage();
    delete users[user_id];
    localStorage.setItem('users', JSON.stringify(users));
  }

  setConfiguration() {
    console.log('setting configurations');
    this.configuration = new Configuration(this.configParam);
    this.loginService.configuration = this.configuration;
    this.usersService.configuration = this.configuration;
    this.operationsService.configuration = this.configuration;
  }

  private setCookiesAndConfig(res, login: Login) {
    return new Promise((resolve => {
      this.setConfiguration();
      this.token.access_token = res.access_token;
      this.token.id = res.id;
      this.addUserInfosToCookies(this.token.id, this.token.access_token, login.email, login.password).then(() => {
        this.configParam.accessToken = res.access_token;
        this.configParam.apiKeys['Authorization'] = 'Bearer ' + res.access_token;
        resolve('done');
      });
    }));
  }

  private getUsersLocalStorage() {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : {};
  }

  private getCurrentUserLocalStorage() {
    return this.getUsersLocalStorage()[this.getId()];
  }

  private addUserInfosToCookies(id, token, email, password) {
    return new Promise((resolve, reject) => {
      this.subDomainService.getDomainNameForCookie().then((cookieDomain) => {
        if (cookieDomain === '.' || cookieDomain === 'localhost') {
          cookieDomain = 'local.host';
        }
        this.cookieService.delete('currentUser_id');
        this.cookieService.delete('currentUser_token');
        this.cookieService.delete('currentUser_pass');
        this.cookieService.delete('currentUser_email');
        this.cookieService.set('currentUser_id', id, undefined, '/', '.' + cookieDomain.toString());
        this.cookieService.set('currentUser_token', token, undefined, '/', '.' + cookieDomain.toString());
        this.cookieService.set('currentUser_pass', password, undefined, '/', '.' + cookieDomain.toString());
        this.cookieService.set('currentUser_email', email, undefined, '/', '.' + cookieDomain.toString());
        resolve();
      });
    });
  }
}
