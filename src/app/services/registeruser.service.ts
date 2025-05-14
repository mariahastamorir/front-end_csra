import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisteruserService {
  private baseUrl = 'http://127.0.0.1:8000/api/';

  constructor(private http: HttpClient) { }

  // Método para registrar usuario
  registerUser(userData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}usuarios/`, userData);
  }

  // Obtener tipos de documento
  getTipoDocumentos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}tipo-documento/`);
  }

  // Obtener roles
  getRoles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}rolxpermiso/`);
  }
}
