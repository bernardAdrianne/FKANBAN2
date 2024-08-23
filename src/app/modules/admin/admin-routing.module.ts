import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { HeaderComponent } from './components/header/header.component';
import { TaskManagerComponent } from './components/task-manager/task-manager.component';

const routes: Routes = [
  { path: '', component: AdminDashboardComponent, 
    children: [
      { path: '', component: HeaderComponent},
      { path: '', component: TaskManagerComponent},
      { path: '', redirectTo: 'admin/home', pathMatch: 'full',}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
