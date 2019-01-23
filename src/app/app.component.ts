import {AuthenticationService} from './_services/authentication.service';
import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'calculator';
  isLoaded = false;

  constructor(public auth: AuthenticationService) {
  }

  ngOnInit() {
    if (this.auth.isLoggedIn()) {
      this.auth.clinicConfiguration().then(() => {
        this.isLoaded = true;
      });
    } else {
      this.isLoaded = true;
    }
  }
}
