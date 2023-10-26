import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DarkmodeService {
  private isDarkMode = new BehaviorSubject<boolean>(false);
  isDarkMode$ = this.isDarkMode.asObservable();
  constructor() { }

  toggleDarkMode() {
    this.isDarkMode.next(!this.isDarkMode.value);
    if (this.isDarkMode.value) {
      document.documentElement.style.setProperty('--background-color', '#111111');
      document.documentElement.style.setProperty('--background-color2', '#333333');
      document.documentElement.style.setProperty('--text-color', 'white');
      document.documentElement.style.setProperty('--filter', 'invert(1)');
    } else {
      document.documentElement.style.removeProperty('--background-color');
      document.documentElement.style.removeProperty('--background-color2');
      document.documentElement.style.removeProperty('--text-color');
      document.documentElement.style.removeProperty('--filter');
    }
  }
}
