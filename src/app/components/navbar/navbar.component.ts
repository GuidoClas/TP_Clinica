import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/Usuario/usuario';
import { AuthService } from 'src/app/services/Auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  public user : Usuario | undefined;

  constructor(public authService: AuthService, public router: Router) {
    this.router.events.subscribe(event => {
      if (event.constructor.name === "NavigationEnd") {
       this.user = this.authService.userLogged;
      }
    })

    this.authService.sesionIniciada.subscribe((user:any) =>{
      this.user = user;
      console.log(this.user);
    });
 
    this.authService.sesionTerminada.subscribe(() => {
      sessionStorage.removeItem("userLogged");
      this.user = undefined; 
    });
  }

  ngOnInit(): void {
    
  }

  onLogout(){
    this.authService.logout();
    setTimeout(()=>{
      this.router.navigate(['/login']);
    }, 1000);
  }

}
