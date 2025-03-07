
import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  writeBatch,
  setDoc,
  collectionData,
  startAfter, limit, DocumentData
} from '@angular/fire/firestore';
import { UserI } from '../models/users.models';

import {
  Storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore/firestore';
import { v4 as uuidv4 } from 'uuid';
import { Observable } from 'rxjs';
import { User } from 'firebase/auth';
import { Computadoras } from '../models/computadora.model';


@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(private firestore: Firestore, private storage: Storage) {}

  // Usuario
  // Eliminar un usuario
  async deleteUser(user: UserI): Promise<void> {
  try {
    if (!user || !user.id) {
      throw new Error('El usuario o el ID de usuario es nulo o no está definido.');
    }
    const userRef = doc(this.firestore, 'usuarios', user.id);
    await deleteDoc(userRef);
    console.log(`Usuario eliminado: ${user.id}`);
  } catch (error) {
    console.error('Error eliminando el usuario:', error);
    throw error;
  }
  }

// Computadoras
   // Obtener todas las computadoras
   async getComputadoras(): Promise<Computadoras[]> {
    const computadorasSnapshot = await getDocs(
      query(collection(this.firestore, 'computadoras'), orderBy('nombre'))
    );
    return computadorasSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Computadoras[];
  }

  // Añadir una nueva computadora
  async addComputadora(computadora:Computadoras, imagen: File): Promise<Computadoras> {
    try {
      if (imagen) {
        const storageRef = ref(this.storage, `computadoras/${imagen.name}`);
        const uploadTask = uploadBytesResumable(storageRef, imagen);
        await uploadTask;
        computadora.imagen = await getDownloadURL(storageRef);
      }
      const id = uuidv4(); // Generar un id único
      const docRef = doc(this.firestore, `computadoras/${id}`);
      await setDoc(docRef, { ...computadora, id });
      console.log(`Computadora añadida con id: ${id}`);
      return { ...computadora, id };
    } catch (error) {
      console.error('Error añadiendo la computadora:', error);
      throw error;
    }
  }

  // Actualizar una computadora existente
  async updateComputadora(computadora: Computadoras, imagen?: File): Promise<void> {
    try {
      if (!computadora.id) {
        throw new Error('La computadora debe tener un id para ser actualizada.');
      }

      if (imagen) {
        // Eliminar la imagen anterior si existe
        if (computadora.imagen) {
          const storageRef = ref(this.storage, computadora.imagen);
          await deleteObject(storageRef);
        }

        // Subir la nueva imagen
        const newStorageRef = ref(this.storage, `computadoras/${imagen.name}`);
        const uploadTask = uploadBytesResumable(newStorageRef, imagen);
        await uploadTask;
        computadora.imagen = await getDownloadURL(newStorageRef);
      }

      const computadoraRef = doc(this.firestore, 'computadoras', computadora.id);
      await updateDoc(computadoraRef, { ...computadora });
    } catch (error) {
      console.error('Error actualizando la computadora:', error);
    }
  }

  // Eliminar una computadora
  async deleteComputadora(computadora: Computadoras): Promise<void> {
    try {
      if (!computadora || !computadora.id) {
        throw new Error('La computadora o el id de la computadora es null o undefined.');
      }

      console.log(`Intentando eliminar la computadora con id: ${computadora.id}`);

      if (computadora.imagen) {
        const storageRef = ref(this.storage, computadora.imagen);
        await deleteObject(storageRef);
        console.log(`Imagen eliminada: ${computadora.imagen}`);
      }

      const computadoraRef = doc(this.firestore, 'computadoras', computadora.id);
      await deleteDoc(computadoraRef);
      console.log(`Computadora eliminada: ${computadora.id}`);
    } catch (error) {
      console.error('Error eliminando la computadora:', error);
    }
  }

}




