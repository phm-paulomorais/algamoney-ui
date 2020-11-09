import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RouterModule } from '@angular/router';
import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';


import { ConfirmationService } from 'primeng/api';
import {ToastModule} from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { NavbarComponent } from './navbar/navbar.component';
import { ErrorHandlerService } from './error-handler.service';
import { LancamentoService } from '../lancamentos/lancamento.service';
import { PessoasService } from './../pessoas/pessoas.service';
import { CategoriaService } from './../categorias/categoria.service';
import { PaginaNaoEncontradaComponent } from './pagina-nao-encontrada.component';
import { AuthService } from './../seguranca/auth.service';
import { NaoAutorizadoComponent } from './nao-autorizado.component';
import { DashboardService } from './../dashboard/dashboard.service';
import { RelatoriosService } from './../relatorios/relatorios.service';


@NgModule({
  declarations: [
    NavbarComponent,
    PaginaNaoEncontradaComponent,
    NaoAutorizadoComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ToastModule,

    ConfirmDialogModule,
  ],
  exports: [
    NavbarComponent,
    ToastModule,

    ConfirmDialogModule
  ],
  providers: [
    ErrorHandlerService,
    LancamentoService,
    PessoasService,
    CategoriaService,
    DashboardService,
    RelatoriosService,
    AuthService,

    ConfirmationService,
    MessageService,
    Title,
    { provide: LOCALE_ID, useValue: 'pt-BR'}
  ]
})
export class CoreModule { }
