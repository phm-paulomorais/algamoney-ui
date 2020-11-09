import { Router } from '@angular/router';
import { Component, ElementRef, HostListener, OnInit } from '@angular/core';

import { AuthService } from './../../seguranca/auth.service';
import { ErrorHandlerService } from './../error-handler.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  exibindoMenu;

  constructor(
    private elementRef: ElementRef,
    public auth: AuthService,
    private errorHandler: ErrorHandlerService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  logout() {
    this.auth.logout()
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  @HostListener('document:click', ['$event'])
  public aoClicar(event) {
    const elementoClicado = event.target;
    const estaDentro = this.elementoClicadoEstaDentroDoMenu(elementoClicado, this.elementRef);


    if (!estaDentro && this.exibindoMenu) {
      this.exibindoMenu = false;
    }

  }

  private elementoClicadoEstaDentroDoMenu(elementoClicado: any, elementRef: ElementRef) {
    while (elementoClicado) {
      if (elementoClicado === elementRef.nativeElement) {
        return true;
      }

      elementoClicado = elementoClicado.parentNode;
    }

    return false;
  }

}
