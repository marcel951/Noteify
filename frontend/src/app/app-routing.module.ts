import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/auth/components/login/login.component';
import { RegisterComponent } from './auth/auth/components/register/register.component';
import { HomeComponent } from './main/home/home.component';
import { NotesComponent } from './main/notes/notes.component';
import { SingleNoteComponent } from './main/single-note/single-note.component';
import { NewNoteComponent } from './main/new-note/new-note.component';
import { UpdateNoteComponent } from './main/update-note/update-note.component';
import { AuthGuardService } from './services/auth-guard.service';

// Neue Such Route um Querry in der URL anzugeben
import { SearchComponent } from "./main/search/search.component";

const routes: Routes = [
{path: 'login', component: LoginComponent},
{path: 'register', component: RegisterComponent},
{path: 'notes',canActivate: [AuthGuardService], component: NotesComponent},
{path: 'new', canActivate: [AuthGuardService],component: NewNoteComponent},
{path: 'note/:id',component: SingleNoteComponent},
{path: 'update/:id', canActivate: [AuthGuardService],component: UpdateNoteComponent},
{path: '', component: HomeComponent},

  // Neue Such Route um Querry in der URL anzugeben
  { path: 'search', component: SearchComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
