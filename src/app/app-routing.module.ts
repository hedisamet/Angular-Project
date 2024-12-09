import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MemberFormComponent } from './member-form/member-form.component';
import { MemberComponent } from './member/member.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ToolsComponent } from './tools/tools.component';
import { EventComponent } from './event/event.component';
import { ArticleComponent } from './article/article.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [
  { 
    path: 'create',
    component: MemberFormComponent,
    canActivate: [AuthGuard]
  },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'member', 
    component: MemberComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: ':id/edit', 
    component: MemberFormComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'tools', 
    component: ToolsComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'event', 
    component: EventComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'article', 
    component: ArticleComponent,
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
