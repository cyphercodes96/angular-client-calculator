# T2Calculator

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.2.3.

# REST api for TransferTo Calc #

Ensure to download `nanobox` which also requires `docker`:

https://docs.nanobox.io/install/

Nanobox allows us to run our application in two different environments:

# Development Environment: #

You'll be required to add a `DNS Alias` to properly and access the Client.

Nanobox offers us a set of commands:

https://docs.nanobox.io/cli/

To add the `DNS Alias`, run:

`nanobox dns add local calculator.com` # <--- The Client will run under "http://`DNS Alias`:3325"

To serve the application under `development` environment, run:

`nanobox run npm start` # <--- project root directory

# Dry-run Environment: #

You'll be required to add a `DNS Alias` to properly access the Client.

Nanobox offers us a set of commands:
https://docs.nanobox.io/cli/

To add the `DNS Alias` under the dry-run environment, run:

`nanobox dns add dry-run calculator.com www.calculator.com` # <--- The Client will run under "http://`DNS Alias`/api/v1"

To serve the application under `Dry-Run` environment, run:

`nanobox deploy dry-run` # <--- project root directory

Deployed client is connected to live deployed API, for SSL certificate and proper communication, since Self-signed certificates were not added to the local environments, http requests won't pass through

### Instructions on getting the app running: ###
- Clone this repository.
- Open up with an editor, Webstorm for example
- run "nanobox run npm start" in project root directory
- add `DNS Alias` eg: `calculator.com`
- Go to `http://calculator.com:3325` to verify that the client is up

### Automatic Deployement and Tests ###
This repo is connected to Semaphore for automatic deployment, so please always run the tests before a git push.
If you don't want to build, test and deploy your push automatically, just add the string "[ci skip]" inside your commit message.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

# Live Deployed API: #
https://personal-calc-client.nanoapp.io/calculator

# Live CI / CD Using Semaphore: #
https://www.useloom.com/share/5d1e715ec99f4a5c904c07d46962dbb9
