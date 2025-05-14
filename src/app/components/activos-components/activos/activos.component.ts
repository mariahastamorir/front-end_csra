import { Component, OnInit} from '@angular/core';
import { ActivosService } from '../../../services/activos.service';
import Swal from 'sweetalert2'; // Alertas

@Component({
  selector: 'app-activos',
  standalone: false,
  templateUrl: './activos.component.html',
  styleUrl: './activos.component.css'
})
export class ActivosComponent implements OnInit{
  
  activos: any[] = [];

  // Control de modal para agregar activos
  showModal: boolean = false;

  // Control de modal para actualizar activos
  showUpdateModal: boolean = false;
  activoSeleccionado: any;

  constructor(private activosService: ActivosService) {}

  ngOnInit(): void {
    this.cargarActivosDinamicamente();
  }

  // Método actualizado para obtener todos los activos
  cargarActivosDinamicamente() {
    this.activosService.getActivo().subscribe({
      next: (data: any) => {
        this.activos = data;
        console.log(this.activos)
      },
      error: (err) => {
        console.error("Error al obtener activos:", err);
        Swal.fire(
          'Error',
          'Hubo un problema al cargar los activos.',
          'error'
        );
      }
    });
  }


  //Metodo para cambio dinamico de color 
  getColor(activo: any, tipo: string): { [klass: string]: any } {
    const colorFondo = activo[`${tipo}_colorActualizado`] ?? activo[`${tipo}_color`];

    return {
      'background-color': colorFondo,
      color: this.getTextColor(colorFondo)
    };
  }


  // Método para ajustar el brillo de un color
  adjustarColor(color: string, amount: number): string {
    const hex = color.replace("#", "");
    const num = parseInt(hex, 16);

    let r = (num >> 16) + amount;
    let g = ((num >> 8) & 0x00ff) + amount;
    let b = (num & 0x0000ff) + amount;

    r = Math.max(Math.min(255, r), 0);
    g = Math.max(Math.min(255, g), 0);
    b = Math.max(Math.min(255, b), 0);

    return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
  }

  // Método para determinar el color del texto
  getTextColor(backgroundColor: string): string {
    if (!backgroundColor) return '#000'; // Si no hay color, usar negro por defecto

    // Convertir el color a RGB para calcular el brillo
    const hex = backgroundColor.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Cálculo del brillo
    const brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255;

    // Si el fondo es claro, oscurecer más
    if (brightness > 0.5) {
      return this.adjustarColor(backgroundColor, -150); // Más oscuro
    } else {
      return "#FFFFFF"; // Cuando es oscuro, texto blanco
    }
  }

  // Abrir y cerrar modal para agregar
  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  // Abrir y cerrar modal de actualización
  openUpdateModal(activo: any) {
    console.log(activo);
    this.activoSeleccionado = activo;
    this.showUpdateModal = true;
  }

  closeUpdateModal() {
    this.showUpdateModal = false;
    this.activoSeleccionado = null;
  }

  
  // Método para eliminar activo con confirmación
  eliminarActivo(activo: any): void {
    Swal.fire({
      title: `¿Eliminar "${activo.nombre}"?`,
      text: `¿Está seguro de eliminar el activo "${activo.nombre}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#28A745',
      cancelButtonColor: '#DC3545',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.activosService.deleteActivo(activo.id).subscribe({
          next: () => {
            this.activos = this.activos.filter(a => a.id !== activo.id);
            Swal.fire(
              '¡Eliminado!',
              `El activo "${activo.nombre}" ha sido eliminado.`,
              'success'
            );
          },
          error: () => {
            Swal.fire(
              'Error',
              `No se pudo eliminar el activo "${activo.nombre}".`,
              'error'
            );
          }
        });
      }
    });
  }

}
