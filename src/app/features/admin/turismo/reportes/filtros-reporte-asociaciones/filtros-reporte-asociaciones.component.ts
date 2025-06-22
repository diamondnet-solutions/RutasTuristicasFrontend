import {Component, EventEmitter, Input, Output, OnInit} from "@angular/core"
import {CommonModule} from "@angular/common"
import {FormsModule, ReactiveFormsModule, FormBuilder, FormGroup} from "@angular/forms"
import {
  FiltrosReporteAsociaciones,
  DatosFiltrosAsociaciones,
} from "../../../../../core/services/reportes-asociaciones.service"

@Component({
  selector: "app-filtros-reporte-asociaciones",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-bold text-gray-900 flex items-center">
          <svg class="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"></path>
          </svg>
          Filtros de Búsqueda - Asociaciones
        </h3>

        <div class="flex gap-2">
          <button
            type="button"
            (click)="limpiarFiltros()"
            class="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            Limpiar
          </button>
          <button
            type="button"
            (click)="aplicarFiltros()"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
            Aplicar Filtros
          </button>
        </div>
      </div>

      <form [formGroup]="filtrosForm" class="space-y-6">
        <!-- Fila 1: Información básica -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Nombre de Asociación</label>
            <input type="text" formControlName="nombre" placeholder="Buscar por nombre..."
                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Municipalidad</label>
            <select formControlName="municipalidad"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">Todas las municipalidades</option>
              <option *ngFor="let municipalidad of datosFiltros?.municipalidades" [value]="municipalidad">
                {{ municipalidad }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Estado</label>
            <select formControlName="estado"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">Todos los estados</option>
              <option value="true">Solo activas</option>
              <option value="false">Solo inactivas</option>
            </select>
          </div>
        </div>

        <!-- Fila 2: Fechas -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Fecha de Creación Desde</label>
            <input type="date" formControlName="fecha_desde"
                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Fecha de Creación Hasta</label>
            <input type="date" formControlName="fecha_hasta"
                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          </div>
        </div>

        <!-- Fila 3: Rangos numéricos -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Emprendedores Mínimo</label>
            <input type="number" formControlName="emprendedores_min" min="0" placeholder="0"
                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Emprendedores Máximo</label>
            <input type="number" formControlName="emprendedores_max" min="0" placeholder="100"
                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Calificación Mínima</label>
            <select formControlName="calificacion_min"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">Sin mínimo</option>
              <option value="1">1 estrella</option>
              <option value="2">2 estrellas</option>
              <option value="3">3 estrellas</option>
              <option value="4">4 estrellas</option>
              <option value="5">5 estrellas</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Calificación Máxima</label>
            <select formControlName="calificacion_max"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">Sin máximo</option>
              <option value="1">1 estrella</option>
              <option value="2">2 estrellas</option>
              <option value="3">3 estrellas</option>
              <option value="4">4 estrellas</option>
              <option value="5">5 estrellas</option>
            </select>
          </div>
        </div>

        <!-- Fila 4: Ordenamiento y acciones -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Ordenar por</label>
            <select formControlName="orden_por"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="nombre">Nombre</option>
              <option value="emprendedores">Número de Emprendedores</option>
              <option value="servicios">Número de Servicios</option>
              <option value="calificacion">Calificación</option>
              <option value="fecha_creacion">Fecha de Creación</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
            <select formControlName="direccion"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="asc">Ascendente</option>
              <option value="desc">Descendente</option>
            </select>
          </div>

          <div class="flex items-end">
            <button
              type="button"
              (click)="previsualizarReporte()"
              [disabled]="previsualizando"
              class="w-full px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              <span *ngIf="!previsualizando">👁️ Previsualizar</span>
              <span *ngIf="previsualizando">Cargando...</span>
            </button>
          </div>

          <div class="flex items-end">
            <button
              type="button"
              (click)="mostrarComparativo()"
              class="w-full px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors">
              📊 Comparativo
            </button>
          </div>
        </div>

        <!-- Filtros activos -->
        <div *ngIf="filtrosActivos.length > 0" class="mt-4">
          <h4 class="text-sm font-medium text-gray-700 mb-2">Filtros Activos:</h4>
          <div class="flex flex-wrap gap-2">
            <span *ngFor="let filtro of filtrosActivos"
                  class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {{ filtro.label }}: {{ filtro.value }}
              <button type="button" (click)="removerFiltro(filtro.key)" class="ml-2 text-blue-600 hover:text-blue-800">
                ×
              </button>
            </span>
          </div>
        </div>
      </form>
    </div>
  `,
})
export class FiltrosReporteAsociacionesComponent implements OnInit {
  @Input() datosFiltros?: DatosFiltrosAsociaciones
  @Input() previsualizando = false
  @Output() filtrosChange = new EventEmitter<FiltrosReporteAsociaciones>()
  @Output() previsualizar = new EventEmitter<FiltrosReporteAsociaciones>()
  @Output() comparativo = new EventEmitter<void>()

  filtrosForm: FormGroup
  filtrosActivos: Array<{ key: string; label: string; value: string }> = []

  constructor(private fb: FormBuilder) {
    this.filtrosForm = this.fb.group({
      nombre: [""],
      municipalidad: [""],
      estado: [""],
      fecha_desde: [""],
      fecha_hasta: [""],
      emprendedores_min: [null],
      emprendedores_max: [null],
      calificacion_min: [null],
      calificacion_max: [null],
      orden_por: ["nombre"],
      direccion: ["asc"],
    })
  }

  ngOnInit() {
    this.filtrosForm.valueChanges.subscribe(() => {
      this.actualizarFiltrosActivos()
    })
  }

  aplicarFiltros() {
    const filtros = this.obtenerFiltrosLimpios()
    this.filtrosChange.emit(filtros)
  }

  previsualizarReporte() {
    const filtros = this.obtenerFiltrosLimpios()
    this.previsualizar.emit(filtros)
  }

  mostrarComparativo() {
    this.comparativo.emit()
  }

  limpiarFiltros() {
    this.filtrosForm.reset({
      orden_por: "nombre",
      direccion: "asc",
    })
    this.filtrosActivos = []
    this.filtrosChange.emit({})
  }

  removerFiltro(key: string) {
    const resetValue = key === "estado" ? "" : key === "orden_por" ? "nombre" : key === "direccion" ? "asc" : null
    this.filtrosForm.patchValue({[key]: resetValue})
    this.aplicarFiltros()
  }

  private obtenerFiltrosLimpios(): FiltrosReporteAsociaciones {
    const formValue = this.filtrosForm.value
    const filtros: FiltrosReporteAsociaciones = {}

    Object.keys(formValue).forEach((key) => {
      const value = formValue[key]
      if (value !== null && value !== "" && value !== undefined) {
        if (key === "estado") {
          filtros[key] = value === "true"
        } else {
          filtros[key] = value
        }
      }
    })

    return filtros
  }

  private actualizarFiltrosActivos() {
    const formValue = this.filtrosForm.value
    this.filtrosActivos = []

    const labels: Record<string, string> = {
      nombre: "Nombre",
      municipalidad: "Municipalidad",
      estado: "Estado",
      fecha_desde: "Fecha Desde",
      fecha_hasta: "Fecha Hasta",
      emprendedores_min: "Emprendedores Mín.",
      emprendedores_max: "Emprendedores Máx.",
      calificacion_min: "Calificación Mín.",
      calificacion_max: "Calificación Máx.",
      orden_por: "Ordenar por",
      direccion: "Dirección",
    }

    Object.keys(formValue).forEach((key) => {
      const value = formValue[key]
      if (value !== null && value !== "" && value !== undefined) {
        let displayValue = value

        if (key === "estado") {
          displayValue = value === "true" ? "Activas" : "Inactivas"
        } else if (key === "calificacion_min" || key === "calificacion_max") {
          displayValue = `${value} estrella${value > 1 ? "s" : ""}`
        } else if (key === "orden_por") {
          const ordenLabels = {
            nombre: "Nombre",
            emprendedores: "Emprendedores",
            servicios: "Servicios",
            calificacion: "Calificación",
            fecha_creacion: "Fecha Creación",
          }
          displayValue = value in ordenLabels
            ? ordenLabels[value as keyof typeof ordenLabels]
            : value;
        } else if (key === "direccion") {
          displayValue = value === "asc" ? "Ascendente" : "Descendente"
        }

        // Solo mostrar filtros relevantes (excluir orden por defecto)
        if (!(key === "orden_por" && value === "nombre") && !(key === "direccion" && value === "asc")) {
          this.filtrosActivos.push({
            key,
            label: labels[key as keyof typeof labels] || key,
            value: displayValue,
          })
        }
      }
    })
  }
}
