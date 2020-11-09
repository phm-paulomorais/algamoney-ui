import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pagina-nao-encontrada',
  template: `
    <div class="container">
      <h1 style="text-align: center">404 - Página não encontrada</h1>
    </div>
  `,
  styles: []
})
export class PaginaNaoEncontradaComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
