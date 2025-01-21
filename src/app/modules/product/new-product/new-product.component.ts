import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../shared/services/category.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductService } from '../../shared/services/product.service';

//Interfaz
export interface Category{
  description: string;
  id: number;
  name: string;
}

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrl: './new-product.component.css'
})
export class NewProductComponent {

  private fb = inject(FormBuilder);
  private categoryService= inject(CategoryService); //Se utiliza para mostrar la categoría asociada al producto
  private dialogRef= inject(MatDialogRef);
  public data = inject(MAT_DIALOG_DATA);

  private productService = inject(ProductService); // Para el servicio de Guardar

  public productForm!: FormGroup;

  //Cuando se tiene que actualizar o crear registros se debe crear una variable que identifique de forma dinámica ambas operaciones
  estadoFormulario: string = "";
  categories: Category[]=[]; //Arreglo de categorías de tipo category () usado en método getCategories
  selectedFile: any;
  nameImg: string ="";

  ngOnInit(): void{
    this.getCategories();

    this.estadoFormulario = "Agregar"; //Estado de formulario cambia a agregar

    //Para agrupar todos los elementos que va a contener el formulario
    this.productForm = this.fb.group( {
      name: ['', Validators.required],
      price: ['', Validators.required],
      quantity: ['', Validators.required],
      category: ['', Validators.required],
      picture: ['', Validators.required]
    })

    if (this.data != null ){
      this.updateForm(this.data);
      this.estadoFormulario = "Actualizar"; //Estado de formulario cambia a Actualizar
    }

  }

  onSave(){
    let data = { //Objeto Json que recoge la informacion guardada en el formulario con los nomnbres que se le dieron al campo
      name: this.productForm.get('name')?.value, //?. evalua si es que existe, sino lo ignora
      price: this.productForm.get('price')?.value,
      quantity: this.productForm.get('quantity')?.value,
      category: this.productForm.get('category')?.value,
      picture: this.selectedFile
    }

    const uploadImageData = new FormData(); //Se tiene que enviar un objeto FormData para guardar los campos en el servicio
    uploadImageData.append('picture', data.picture, data.picture.name); //Los nombres deben ser iguales a los configurados en el modelo del backend
    uploadImageData.append('name', data.name);
    uploadImageData.append('price', data.price);
    uploadImageData.append('quantity', data.quantity);
    uploadImageData.append('categoryId', data.category);

    //  Llamamos al servicio para guardar el producto
    if (this.data != null){
      //update the product
      this.productService.updateProduct(uploadImageData, this.data.id)
                .subscribe( (data: any) =>{
                  this.dialogRef.close(1);
                }, (error: any) => {
                  this.dialogRef.close(2);
                })
    } else {
      //call the service to save a product
      this.productService.saveProduct(uploadImageData)
              .subscribe( (data: any) =>{
                this.dialogRef.close(1);
              }, (error: any) => {
                this.dialogRef.close(2);
              })
    }

  }

  onCancel(){
    this.dialogRef.close(3);
  }

  //Este método regresa todas las categorías de la BD
  getCategories(){
    this.categoryService.getCategories()
        .subscribe( (data: any) =>{
          this.categories = data.categoryResponse.category; //Se accede al arreglo de categorías ¿de dónde sale catregoryResponse? es una propiedad de data definida en la respuesta del backend
        }, (error: any) =>{
          console.log("error al consultar categorias");
        })
  }

  onFileChanged(event: any){

    this.selectedFile = event.target.files[0]; //Se accede al archivo 
    console.log(this.selectedFile);

    this.nameImg = event.target.files[0].name;


  }

  updateForm(data: any){

    this.productForm = this.fb.group( {
      name: [data.name, Validators.required],
      price: [data.price, Validators.required],
      account: [data.account, Validators.required],
      category: [data.category.id, Validators.required],
      picture: ['', Validators.required]
    })
  }

}
