import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/Auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RedirectGuard implements CanActivate {
  constructor( private AuthService : AuthService, private router : Router ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      const redirects = route.data.redirects;
      const usuario = this.AuthService.userLogged;
      
      if ( !usuario || !redirects )
        return false;
  
      for ( const redirect of redirects ) {
        if ( redirect.role === usuario.razon )
          return this.router.createUrlTree( [redirect.route] )
      }
      
      return false;
    }
  
}
