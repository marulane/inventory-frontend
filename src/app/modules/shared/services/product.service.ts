import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
/*Esta clase sirve para aislar la lógica de conectividad a otros servicios o ApiRest*/

const base_url = "http://localhost:8080/api/v1";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  /**
   * get all the products
   */
  getProducts(){
    //console.log("El metodo se esta ejecutando");
    const endpoint = `${base_url}/products`;
    return this.http.get(endpoint);
  }

  /**
   * save the product REVISAR EN PRODUCT REST CONTROLLER LA URL CORRECTA DEL MÉTODO ALGUNAS DICEN PRODUCT Y OTRAS PRODUCTS
   */

  saveProduct(body: any){
    const endpoint = `${base_url}/products`;
    return this.http.post(endpoint, body);
  }

  /**
   * update product
   */
  updateProduct (body: any, id: any){
    const endpoint = `${ base_url}/products/${id}`;
    return this.http.put(endpoint, body);
  }
  /**
   * delete product
   */
  deleteProduct(id: any){
    const endpoint = `${ base_url}/product/${id}`;
    return this.http.delete(endpoint);
  }

  /**
   * search by name
   */
  getProductByName(name: any){
    const endpoint = `${ base_url}/product/filter/${name}`;
    return this.http.get(endpoint);
  }


  /**
   * export excel products
   */
  exportProduct(){
    const endpoint = `${base_url}/products/export/excel`;
    return this.http.get(endpoint, {
      responseType: 'blob'
    });
  }
}
