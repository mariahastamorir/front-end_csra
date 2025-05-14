import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, SimpleChange,} from '@angular/core';
import { ActivosService } from '../../../services/activos.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modaleditaractivo',
  standalone: false,
  templateUrl: './modaleditaractivo.component.html',
  styleUrl: './modaleditaractivo.component.css'
})
export class ModaleditaractivoComponent implements OnInit, OnChanges{
  isLoading: boolean = false;
  
  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() activoActualizado = new EventEmitter<void>();

  @Input() activo: any;
  
  activoEditForm: FormGroup;
  
  confidencialidad1: any[] = [];
  integridad1: any[] = [];
  disponibilidad1: any[] = [];
  proceso1: any[] = [];
  tipodeactivo1: any[] = [];
  datospersonales1: any[] = [];
  custodio1: any[] = [];
  duenodeactivo1: any[] = [];

  constructor(private activosService: ActivosService, private fb:FormBuilder){
    this.activoEditForm = this.fb.group({
      id: [''],
      nombre: ['', [Validators.required]],
      proceso_area: ['', [Validators.required]],
      tipo_activo: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],  
      datos_personales: ['', [Validators.required]],
      dueno_activo: ['', [Validators.required]],
      custodio: ['', [Validators.required]],
      estadoxactivo: this.fb.group({
        confidencialidad: [''],
        integridad: [''],
        disponibilidad: [''],
        criticidad: [''],
      })
    });
  }
 
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['activo'] && this.activo) {
      this.activoEditForm.patchValue({
        id: this.activo.id,
        nombre: this.activo.nombre,
        descripcion: this.activo.descripcion,
        proceso_area: this.activo.proceso_area_id,
        tipo_activo: this.activo.tipo_activo_id,
        datos_personales: this.activo.datos_personales_id,
        dueno_activo: this.activo.dueno_activo_id,
        custodio: this.activo.custodio_id,
        estadoxactivo: {
          confidencialidad: this.activo.confidencialidad_id,
          integridad: this.activo.integridad_id,
          disponibilidad: this.activo.disponibilidad_id,
        }
      });      
    }
  }

  ngOnInit(): void {
    this.isLoading = true; // Mostrar spinner al iniciar la carga

    //Cargar datos de confidencialidad
    this.activosService.getConfidencialidad().subscribe(data => { 
      this.confidencialidad1 = data;
      this.checkDataLoaded(); //Metodo para verificar si todos los datos cargaron
    });

    //Cargar datos de Integridad
    this.activosService.getIntegridad().subscribe(data => { 
      this.integridad1 = data;
      this.checkDataLoaded(); 
    });

    //Cargar datos de Disponibilidad
    this.activosService.getDisponibilidad().subscribe(data => { 
      this.disponibilidad1 = data;
      this.checkDataLoaded(); 
    });

    //Cargar datos de proceso
    this.activosService.getProceso().subscribe(data => { 
      this.proceso1 = data;
      this.checkDataLoaded(); 
    });

    //Cargar datos de Tipo de activo
    this.activosService.getTipoDeActivo().subscribe(data => { 
      this.tipodeactivo1 = data;
      this.checkDataLoaded(); 
    });

    //Cargar datos de datos personales activo
    this.activosService.getDatosPersonalesActivo().subscribe(data => { 
      this.datospersonales1 = data;
      this.checkDataLoaded(); 
    });

    //Cargar datos de dueno de activo
    this.activosService.getDuenoDelActivo().subscribe(data => { 
      this.duenodeactivo1 = data;
      this.checkDataLoaded(); 
    });

    //Cargar datos de custodio
    this.activosService.getCustodio().subscribe(data => { 
      this.custodio1 = data;
      this.checkDataLoaded(); 
    });
  }

  checkDataLoaded() {
    // Verificar si todos los datos se han cargado
    if (
      this.confidencialidad1.length > 0 &&
      this.integridad1.length > 0 &&
      this.disponibilidad1.length > 0 &&
      this.proceso1.length > 0 &&
      this.tipodeactivo1.length > 0 &&
      this.datospersonales1.length > 0 &&
      this.duenodeactivo1.length > 0 &&
      this.custodio1.length > 0
    ) {
      this.isLoading = false;  // Ocultar el spinner cuando todos los datos están cargados
    }
  }

  closeModalUpdate() {
    this.close.emit(); // Notifica al padre que el modal se cerró
  }

  onSubmit(): void{
    if (this.activoEditForm.valid) {
      console.log('Datos a enviar', this.activoEditForm.value);

      this.activosService.updateActivo(this.activoEditForm.value).subscribe(
        response => {
          console.log('actualización exitosa', response);
          Swal.fire({
            icon: 'success',
            title: '¡Actualización exitosa!',
            text: 'Activo actualizado correctamente',
            confirmButtonColor: '#3085d6'
          }).then(() => {
            this.activoActualizado.emit();
            this.activoEditForm.reset();
            this.closeModalUpdate();
          });
        },
        error => {
          console.log('Error al editar el activo', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al registrar el activo',
            confirmButtonColor: '#d33'
          });
        }
      );
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Formulario incompleto',
        text: 'Debe completar los campos correctamente.',
        confirmButtonColor: '#f0ad4e'
      });
    }
  }
  
}
