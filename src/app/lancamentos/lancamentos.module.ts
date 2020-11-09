import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { SharedModule } from './../shared/shared.module';
import { LancamentosPesquisaComponent } from './lancamentos-pesquisa/lancamentos-pesquisa.component';
import { LancamentoCadastroReativoComponent } from './lancamento-cadastro/lancamento-cadastro-reativo.component';
import { LancamentosRoutingModule } from './lancamentos-routing.module';
import { LancamentoCadastroComponent } from './lancamento-cadastro/lancamento-cadastro-template/lancamento-cadastro.component';

@NgModule({
  declarations: [
    LancamentoCadastroComponent,
    LancamentoCadastroReativoComponent,
    LancamentosPesquisaComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    InputTextModule,
    ButtonModule,
    TableModule,
    TooltipModule,
    InputTextareaModule,
    SelectButtonModule,
    CalendarModule,
    DropdownModule,
    CurrencyMaskModule,
    FileUploadModule,
    ProgressSpinnerModule,

    SharedModule,
    LancamentosRoutingModule
  ],
  exports: []
})
export class LancamentosModule { }
