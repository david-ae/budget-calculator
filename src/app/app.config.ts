import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { WindowRef } from './windowRef';
import { IndexDbService } from './services/index-db.service';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), WindowRef, IndexDbService],
};
