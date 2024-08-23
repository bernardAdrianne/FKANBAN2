import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { HeaderComponent } from './components/header/header.component';
import { TaskManagerComponent } from './components/task-manager/task-manager.component';
import { FilterByColumnPipe } from '../../pipes/filter-by-column.pipe';

@NgModule({
  declarations: [
    AdminDashboardComponent,
    HeaderComponent,
    TaskManagerComponent,
    FilterByColumnPipe,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminRoutingModule,
  ]
})
export class AdminModule { }
