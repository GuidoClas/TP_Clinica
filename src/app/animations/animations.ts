import { animate, style, transition, trigger, query, animateChild, group } from '@angular/animations';

export const slideInAnimation =
  trigger('routeAnimations', [
    transition('* <=> *', [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '300vh',
          height: '100vh',
          background: 'url( "../assets/clinic-wp-big.jpg" )'
        })
      ]),
      query(':enter', [
        style({ left: '-100%' })
      ]),
      query(':leave', animateChild()),
      group([
        query(':leave', [
          animate('500ms ease-out', style({ left: '100%' })),
          style({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '300vh',
            height: '100vh',
            background: 'url( "../assets/clinic-wp-big.jpg" )'
          })
        ]),
        query(':enter', [
          animate('800ms ease-out', style({ left: '0%' })),
          style({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '300vh',
            height: '100vh',
            background: 'url( "../assets/clinic-wp-big.jpg" )'
          })
        ])
      ]),
      query(':enter', animateChild()),
    ])
  ]);