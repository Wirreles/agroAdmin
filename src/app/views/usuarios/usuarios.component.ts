import { FirestoreService } from '../../common/services/firestore.service';
import { UserService } from '../../common/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { UserI } from 'src/app/common/models/users.models';
import { OverlayEventDetail } from '@ionic/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';


@Component({
  standalone: true,
  imports: [
CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
})
export class UsuariosPage implements OnInit {

  usuarios: UserI[] = [];
  usuariosPendientes: any[] = [];

  constructor(
    private firestoreService: FirestoreService,
    private UserService: UserService,
  ) {}

    ngOnInit(): void {
    this.cargarUsuarios();
  }

  async cargarUsuarios() {
    try {
      this.usuarios = await this.UserService.getAllUsers();
      console.log('Usuarios cargados:', this.usuarios);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
    }
  }


 async eliminarUsuario(usuario: UserI) {
  const confirmacion = window.confirm(`¿Estás seguro de que quieres eliminar al usuario ? Esta acción no se puede deshacer.`);
  if (!confirmacion) return;

  console.log('Eliminando usuario:', usuario);

  try {
    await this.firestoreService.deleteUser(usuario);
    this.usuarios = this.usuarios.filter((u) => u.id !== usuario.id);
    console.log(`Usuario eliminado: ${usuario.id}`);
    window.alert('Usuario eliminado con éxito.');
  } catch (error) {
    console.error('Error eliminando el usuario:', error);
    window.alert('Error al eliminar el usuario. Por favor, inténtalo de nuevo.');
  }
}


}
