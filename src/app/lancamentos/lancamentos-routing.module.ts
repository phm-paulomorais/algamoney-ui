import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';


import { LancamentosPesquisaComponent } from './lancamentos-pesquisa/lancamentos-pesquisa.component';
import { LancamentoCadastroReativoComponent } from './lancamento-cadastro/lancamento-cadastro-reativo.component';
import { AuthGuard } from '../seguranca/auth.guard';


const routes: Routes = [
  {
    path: '',
    component: LancamentosPesquisaComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_PESQUISAR_LANCAMENTO']}
  },
  {
    path: 'novo',
    component: LancamentoCadastroReativoComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_CADASTRAR_LANCAMENTO']}
  },
  {
    path: ':codigo',
    component: LancamentoCadastroReativoComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_CADASTRAR_LANCAMENTO']}
  },
];


@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class LancamentosRoutingModule { }
