import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { slideInAnimation } from './animations/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    slideInAnimation
  ]
})
export class AppComponent {
  title = 'TP_Clinica';

  prepareRoute( outlet : RouterOutlet ) {
    let animation = outlet?.activatedRouteData?.['animation'];
    return animation;
  }
}
