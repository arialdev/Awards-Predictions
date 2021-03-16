import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RegisterComponent} from './components/register/register.component';
import {VotingComponent} from './components/voting/voting.component';
import {VotesResultComponent} from './components/votes-result/votes-result.component';

const routes: Routes = [
  {path: 'register', component: RegisterComponent},
  // {path: 'home', component: RegisterComponent},
  {path: 'voting/:eventId', component: VotingComponent},
  {path: 'voting/:eventId/result', component: VotesResultComponent},
  {path: '', redirectTo: '/register', pathMatch: 'full'},
  {path: '**', redirectTo: '/register', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: false})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
