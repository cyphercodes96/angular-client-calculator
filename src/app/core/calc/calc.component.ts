import {Configuration, ConfigurationParameters, OperationForPost, OperationsService} from '../../../../out';
import {AuthenticationService} from '../../_services/authentication.service';
import {ErrorHandlingService} from '../../_services/error-handling.service';
import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-calc',
  templateUrl: './calc.component.html',
  styleUrls: ['./calc.component.css']
})
export class CalcComponent implements OnInit {

  output = '0';
  operator: string;
  number0: number;
  number1: number;
  key: string;
  configParam: ConfigurationParameters = {
    apiKeys: {['Authorization']: ''},
    username: '',
    accessToken: '',
    password: '',
    basePath: ''
  };
  configuration: Configuration;

  constructor(public operationService: OperationsService,
              public errHandlingService: ErrorHandlingService,
              public authService: AuthenticationService) {
    this.key = this.authService.getToken();
  }

  ngOnInit(): void {
    document.onkeydown = (e) => {
      if (e.key.match('[+\\-\\/!^*√∛]')) {
        this.operate(e.key);
      } else if (e.key.match('\\d') || e.key === '.') {
        this.updateOutput(e.key);
      } else if (e.key === 'Enter') {
        this.equal();
      } else if (e.key === 'Escape') {
        this.clear();
      } else if (e.key === 'Backspace') {
        if (this.output.length === 0) {
          this.operator = null;
        } else {
          this.output = this.output.slice(0, -1);
          if (this.output.length === 0 && this.operator) {
            this.output = this.operator;
          }
        }
      }

    };
  }

  operate(event) {
    if (this.operator) {
      this.number1 = Number(this.output);
      // this.operator = event;
      this.equal(event);
      return;
    }
    this.operator = event;
    this.number0 = Number(this.output);
    this.output = event;
  }

  updateOutput(event) {
    let op = this.output[this.output.length - 1];
    if (op === '+' || op === '-' || op === '*' || op === '/' || op === '√' || op === '∛' || op === '!' || op === '^') {
      this.operate(event);
      this.output = event;
      return;
    }
    if (this.output === '0' || this.output === '+' || this.output === '-' || this.output === '*' ||
      this.output === '/' || this.output === '√' || this.output === '∛' || this.output === '!' ||
      this.output === '^') {
      this.output = event;
    } else {
      this.output = this.output + event.toString();
    }
  }

  equal(op?) {
    this.number1 = Number(this.output);
    this.postOPeration(op);
  }

  clear() {
    this.output = '0';
    this.operator = undefined;
    this.number0 = undefined;
    this.number1 = undefined;
  }

  postOPeration(operator?) {
    let op: OperationForPost = {} as OperationForPost;
    op.operator = this.operator;
    if (op.operator === '!' && this.number0) {
      op.number1 = undefined;
      op.number0 = this.number0;
      this.authService.refreshToken().then(() => {
        this.operationService.postOperationsCollection(op, this.key).subscribe((res) => {
          if (operator) {
            this.output = res.result + ' ' + operator;
            this.number0 = res.result;
            this.operator = operator;
          } else {
            this.clear();
            this.output = res.result;
            this.number0 = res.result;
          }
        }, err => {
          this.errHandlingService.handleError(err, 'calc-component, postOperationsCollection');
        });
      });
    } else if ((op.operator === '√' || op.operator === '∛') && this.number1) {
      op.number0 = undefined;
      op.number1 = this.number1;
      this.authService.refreshToken().then(() => {
        this.operationService.postOperationsCollection(op, this.key).subscribe((res) => {
          // this.clear();
          if (operator) {
            this.output = res.result + ' ' + operator;
            this.number0 = res.result;
            this.operator = operator;
          } else {
            this.clear();
            this.output = res.result;
            this.number0 = res.result;
          }
        }, err => {
          this.errHandlingService.handleError(err, 'calc-component, postOperationsCollection2');
        });
      });
    } else {
      if ((op.operator === '+' || op.operator === '-' || op.operator === '*' || op.operator === '/' || op.operator === '^') &&
        (this.number1 || this.number1 === 0) && (this.number0 || this.number0 === 0)) {
        op.number0 = this.number0;
        op.number1 = this.number1;
        this.authService.refreshToken().then(() => {
          this.operationService.postOperationsCollection(op, this.key).subscribe((res) => {
            // this.clear();
            if (operator) {
              this.output = res.result + ' ' + operator;
              this.number0 = res.result;
              this.operator = operator;
            } else {
              this.clear();
              this.output = res.result;
              this.number0 = res.result;
            }
          }, err => {
            this.errHandlingService.handleError(err, 'calc-component, postOperationsCollection3');
          });
        });
      }
    }
  }
}
