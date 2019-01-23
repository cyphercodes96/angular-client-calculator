import {AuthenticationService} from '../../_services/authentication.service';
import {ErrorHandlingService} from '../../_services/error-handling.service';
import {Component, Inject, OnInit} from 'node_modules/@angular/core';
import {LoaderService} from '../../_services/loader.service';
import {ActivatedRoute, Router} from '@angular/router';
import {BASE_PATH, UsersService} from '../../../../out';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {
  url: string | ArrayBuffer;
  patientId: string;
  realPPUrl: string;
  userId: string;
  key: string;
  file: any;

  constructor(public auth: AuthenticationService,
              public route: ActivatedRoute,
              public loaderService: LoaderService,
              public usersService: UsersService,
              public errService: ErrorHandlingService,
              public router: Router,
              @Inject(BASE_PATH) apiBaseUrl: string) {
    this.key = this.auth.getToken();
    this.userId = this.auth.getId();
  }

  ngOnInit() {
    this.usersService.getUserItem(this.key, this.userId).subscribe((res) => {
    }, err => {
      this.errService.handleError(err, 'getUserItem from side-bar component');
    });
  }

  isPatientRouteActive() {
    if (this.router.url.includes('/patient/')) {
      this.patientId = this.route.snapshot.children[0].children[0].params['id'];
      return true;
    }
  }

  onPatientsClicked() {
    if (this.router.url.includes('patient/')) {
      localStorage.removeItem('UserLastAccessedPatient');
    }
  }
}
