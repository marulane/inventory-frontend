import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../../shared/services/category.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-category',
  templateUrl: './new-category.component.html',
  styleUrl: './new-category.component.css'
})
export class NewCategoryComponent implements OnInit{

  //Declarar objeto para manejar el formulario para validaciones etc

  public categoryForm!: FormGroup //El signo es para declarar el formulario
  //Inyectar formbuilder que trabajará en conjunto con formgroup para el manejo de formulario
  private fb = inject(FormBuilder);
  private categoryService= inject(CategoryService);
  private dialogRef= inject(MatDialogRef); //Metodo del componente categoria
  public data = inject(MAT_DIALOG_DATA); //Para recibir datos del componente padre
  estadoFormulario: string ="";

  //OnInit se declaro manualmente
  ngOnInit(): void {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    })

    console.log(this.data)
    this.estadoFormulario= "Agregar";

    if(this.data != null){
      this.updateForm(this.data);
      this.estadoFormulario="Actualizar"
    }
    
  }

  onSave(){
    let data ={ //objeto de tipo Json, almacena los datos introducidos por medio de un formulario
      name: this.categoryForm.get('name')?.value,
      description: this.categoryForm.get('description')?.value
    }
    if(this.data != null){

      //update register
      this.categoryService.updateCategory(data, this.data.id)
      .subscribe( (data: any) =>{
        this.dialogRef.close(1);
      }, (error:any)=>{
        this.dialogRef.close(2);
      })

    }else{

        //create registry
        this.categoryService.saveCategory(data) //con el servicio de categoria inyectado guardamos el objeto json en el api rest de spring boot
      .subscribe( data => {
        console.log(data) //Para imprimir y verificar los datos guardados
        this.dialogRef.close(1); //Cierra el diálogo que llamó a este método
      }, (error: any)=>{
        this.dialogRef.close(2); //Los números son códigos de errores que se manejarán más adelante
      })
      }
    
  }

  onCancel(){
    this.dialogRef.close(3); //Cierra el cuadro de diálogo
  }

  updateForm(data: any){
    this.categoryForm = this.fb.group({
      name: [data.name, Validators.required],
      description: [data.description, Validators.required]
    })
  }
}
