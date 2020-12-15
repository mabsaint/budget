import {NativeDateAdapter} from '@angular/material';
import {Injectable} from '@angular/core';
import { Platform } from '@angular/cdk/platform';


@Injectable()
export class CustomDateAdapter extends NativeDateAdapter {

  constructor() {
    super('bg-BG', new Platform());
  }

  getFirstDayOfWeek(): number {
    return 1;
  }
}
