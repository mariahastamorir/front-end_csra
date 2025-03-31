import { NgModule, OnInit } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ContactenosComponent } from './components/contactenos/contactenos.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PaginaprincipalComponent } from './components/paginaprincipal/paginaprincipal.component';
import { CambiarContrasenaComponent } from './components/cambiar-contrasena/cambiar-contrasena.component';
import { ActivosComponent } from './components/activos/activos.component';
import { RegistrousuariosComponent } from './components/registrousuarios/registrousuarios.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegistrousuariosComponent
  },
  {
    path: 'contact',
    component: ContactenosComponent
  },
  {
    path: 'changepassword',
    component: CambiarContrasenaComponent
  },
  {
    path: 'homepage',
    component: PaginaprincipalComponent
  },
  {
    path: 'assets',
    component: ActivosComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 


}
