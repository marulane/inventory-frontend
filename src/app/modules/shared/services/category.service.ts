import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
/*Esta clase sirve para aislar la lógica de conectividad a otros servicios o ApiRest*/

const base_url = "http://localhost:8080/api/v1";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { } /*Esta librería de Angular permite establecer conexión con los distinos métodos HTTP*/

  /**
   * GET ALL CATEGORIES
   */
  getCategories(){
    //Endpoint de la aplicación 
    const endpoint = `${base_url}/categories`;
    return this.http.get(endpoint);
  }
}
