import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Usuario } from '../models/Usuario/usuario';
import { AuthService } from '../services/Auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private AuthService: AuthService){ }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    const roles = route.data?.roles;
    let item : any = sessionStorage.getItem("userLogged");
    let user : Usuario;
    let rout = route.url;
    console.log(rout);
    if(item) {
      user = JSON.parse(item);

      for(const role of roles){
        if(role == user.razon) return true;
      }
    }
    
    return false;
  }
  
}
