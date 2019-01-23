import {AuthenticationService} from '../../_services/authentication.service';
import {ErrorHandlingService} from '../../_services/error-handling.service';
import {OperationGet, OperationsService} from '../../../../out';
import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  operations: Array<OperationGet> = [];
  dateTimeRange: any = [];
  customPicking = false;
  startDate: any;
  endDate: any;
  key: string;

  constructor(public operationsService: OperationsService,
              public authService: AuthenticationService,
              public errHandlingService: ErrorHandlingService) {
    this.key = this.authService.getToken();
  }

  ngOnInit() {
    console.log('initialized reports component');
  }

  setTodayReport() {
    this.triggerCustomDatePickerOff();
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    this.startDate = start.toISOString();
    this.endDate = end.toISOString();
    this.getOperationsReport();
  }

  setWeeklyReport() {
    this.triggerCustomDatePickerOff();
    const curr = new Date; // get current date
    const first = curr.getDate() - curr.getDay() + 1; // First day is the day of the month - the day of the week
    const last = first + 7; // last day is the first day + 6

    const start = new Date(curr.setDate(first)).toISOString();
    const end = new Date(curr.setDate(last)).toISOString();
    this.startDate = start;
    this.endDate = end;
    this.getOperationsReport();
  }

  setMonthlyReport() {
    this.triggerCustomDatePickerOff();
    const date = new Date();
    const monthStartDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const monthEndDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    this.startDate = monthStartDay.toISOString();
    this.endDate = monthEndDay.toISOString();
    this.getOperationsReport();
  }

  dateRangeSelected() {
    this.startDate = new Date(this.dateTimeRange[0]).toISOString();
    this.endDate = new Date(this.dateTimeRange[1]).toISOString();
    this.getOperationsReport();
  }

  triggerCustomDatePickerOn() {
    this.operations = [];
    this.dateTimeRange = [];
    this.customPicking = true;

  }

  triggerCustomDatePickerOff() {
    this.operations = [];
    this.customPicking = false;
  }

  getOperationsReport() {
    this.authService.refreshToken().then(() => {
      this.operationsService.getOperationsCollection(this.key, this.endDate, this.startDate).subscribe((res) => {
        this.operations = res;
      }, err => {
        this.errHandlingService.handleError(err, 'report-component, getOperationsCollection');
      });
    });
  }
}
