import {environment} from '../environments/environment';
import {IAppConfig} from './_models/app.config.model';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class AppConfig {

  static settings: IAppConfig;

  constructor(private http: HttpClient) {
  }

  load() {
    const jsonFile = `config/config${environment.production ? '' : '.dev'}.json`;
    return new Promise<void>((resolve, reject) => {
      this.http.get<IAppConfig>(jsonFile).toPromise().then((response: IAppConfig) => {
        if (!this.isInstanceOfIAppConfig(response)) {
          reject(`Could not load file '${jsonFile}': Json format does not match config`);
        }
        AppConfig.settings = response;
        resolve();
      }).catch((response: any) => {
        reject(`Could not load file '${jsonFile}': ${JSON.stringify(response)}`);
      });
    });
  }

  isInstanceOfIAppConfig(object: any): object is IAppConfig {
    // ugly way to check integrity, has to be redone
    return 'apiBaseUrl' in object;
  }

}
