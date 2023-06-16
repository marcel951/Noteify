import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/auth/components/login/login.component';
import { RegisterComponent } from './auth/auth/components/register/register.component';
import { HomeComponent } from './main/home/home.component';
import { NotesComponent } from './main/notes/notes.component';
import { SingleNoteComponent } from './main/single-note/single-note.component';

const routes: Routes = [
{path: 'login', component: LoginComponent},
{path: 'register', component: RegisterComponent},
{path: 'notes', component: NotesComponent},
{path: 'note/:id', component: SingleNoteComponent},
{path: '', component: HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
