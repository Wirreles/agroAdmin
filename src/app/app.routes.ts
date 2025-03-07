import { Routes,RouterModule } from '@angular/router';

import { HomeComponent } from './views/home/home.component';
import { ComputadoraPage } from './views/computadora/computadora.component';



export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'usuarios',
    loadComponent: () => import('./views/usuarios/usuarios.component').then((m) => m.UsuariosPage),
  },

  {
    path: 'computadora',
    loadComponent: () => import('./views/computadora/computadora.component').then((m) => m.ComputadoraPage),
  },

];
