import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';

import { ChartModule } from 'primeng/chart';
import { PanelModule } from 'primeng/panel';


import { SharedModule } from './../shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';


@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,

    ChartModule,
    PanelModule,


    DashboardRoutingModule,
    SharedModule
  ],
  providers: [ DecimalPipe ]
})
export class DashboardModule { }
