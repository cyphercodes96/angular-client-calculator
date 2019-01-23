import {Injectable} from '@angular/core';

@Injectable()
export class DomainService {

  getDomainNameForCookie() {
    return new Promise(((resolve, reject) => {
      const domain = this.extractRootDomain(window.location.host);
      let splitArr = domain.split('.');
      if (splitArr[0] === 'www') {
        splitArr.splice(0, 1);
      }
      const indexOfDevRootDomain = splitArr.indexOf(this.extractRootDomain(window.location.host));
      const isAtDevDomain = indexOfDevRootDomain > -1;
      if (isAtDevDomain && splitArr.length > 1) {
        splitArr = splitArr.slice(indexOfDevRootDomain + 1);
      }
      resolve(splitArr.join('.'));
    }));
  }

  extractHostname(url) {
    let hostname;
    // find & remove protocol (http, ftp, etc.) and get hostname

    if (url.indexOf('://') > -1) {
      hostname = url.split('/')[2];
    } else {
      hostname = url.split('/')[0];
    }

    // find & remove port number
    hostname = hostname.split(':')[0];
    // find & remove "?"
    hostname = hostname.split('?')[0];

    return hostname;
  }

  private extractRootDomain(url) {
    let domain = this.extractHostname(url);
    let splitArr = domain.split('.');
    if ((splitArr[0] === 'www' && splitArr.length === 3) || (splitArr[0] === 'www' && splitArr.length === 2)
      || (splitArr[0] !== 'www' && splitArr.length === 2) || splitArr.length < 2) {
      domain = splitArr.join('.');
      return domain;
    } else {
      if (splitArr[0] === 'www') {
        splitArr = splitArr.slice(2);
      } else {
        splitArr = splitArr.slice(1);
      }
      domain = splitArr.join('.');
      return domain;
    }
  }
}
