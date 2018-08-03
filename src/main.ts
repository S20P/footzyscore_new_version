import { enableProdMode, isDevMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';


if (environment.production) {
  enableProdMode();
  window.console.log = function () { };
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));

//console.log("env is", environment);

if (environment.production == true) {
  window.console.log = function () { };
}


//console.log("dev",isDevMode());

if (isDevMode()) {
  window.console.log = function () { };
}







