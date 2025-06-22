import { Component, Input, Output, EventEmitter } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"

@Component({
  selector: "app-comparativo-asociaciones",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-bold text-gray-900 flex items-center">
          <svg class="w-6 h-6 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
          Análisis Comparativo de Asociaciones
        </h3>

        <div class="flex gap-2">
          <button
            (click)="generarComparativo.emit()"
            [disabled]="asociacionesSeleccionadasIds.length < 2"
            class="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            📊 Generar Comparativo
          </button>
          <button
            (click)="cerrar.emit()"
            class="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            ✕ Cerrar
          </button>
        </div>
      </div>

      <div class="mb-6">
        <p class="text-gray-600 mb-4">
          Seleccione al menos 2 asociaciones para generar un análisis comparativo detallado.
          El reporte incluirá métricas de rendimiento, gráficos comparativos y recomendaciones.
        </p>

        <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h4 class="font-semibold text-blue-900 mb-2">Asociaciones Seleccionadas: {{ asociacionesSeleccionadasIds.length }}</h4>
          <div class="flex flex-wrap gap-2">
            <span *ngFor="let asociacion of getAsociacionesSeleccionadas()"
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {{ asociacion.nombre }}
              <button
                (click)="deseleccionarAsociacion(asociacion.id)"
                class="ml-2 text-blue-600 hover:text-blue-800">
                ×
              </button>
            </span>
          </div>
        </div>
      </div>

      <!-- Lista de Asociaciones Disponibles -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div *ngFor="let asociacion of asociacionesDisponibles"
             class="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
             [class.border-purple-500]="isSelected(asociacion.id)"
             [class.bg-purple-50]="isSelected(asociacion.id)"
             (click)="toggleSeleccion(asociacion.id)">

          <div class="flex items-start justify-between mb-3">
            <div class="flex-1">
              <h5 class="font-semibold text-gray-900 mb-1">{{ asociacion.nombre }}</h5>
              <p class="text-sm text-gray-600">{{ asociacion.ubicacion }}, {{ asociacion.municipalidad }}</p>
            </div>
            <div class="ml-2">
              <input
                type="checkbox"
                [checked]="isSelected(asociacion.id)"
                (change)="toggleSeleccion(asociacion.id)"
                class="rounded border-gray-300 text-purple-600 shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50">
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2 text-sm">
            <div class="bg-gray-50 rounded p-2">
              <div class="text-xs text-gray-500">Emprendedores</div>
              <div class="font-semibold text-blue-600">{{ asociacion.emprendedores_count }}</div>
            </div>
            <div class="bg-gray-50 rounded p-2">
              <div class="text-xs text-gray-500">Servicios</div>
              <div class="font-semibold text-green-600">{{ asociacion.servicios_count }}</div>
            </div>
            <div class="bg-gray-50 rounded p-2">
              <div class="text-xs text-gray-500">Calificación</div>
              <div class="font-semibold text-yellow-600 flex items-center">
                <span class="mr-1">⭐</span>
                {{ asociacion.calificacion }}
              </div>
            </div>
            <div class="bg-gray-50 rounded p-2">
              <div class="text-xs text-gray-500">Estado</div>
              <div [class]="asociacion.estado ? 'font-semibold text-green-600' : 'font-semibold text-red-600'">
                {{ asociacion.estado ? 'Activa' : 'Inactiva' }}
              </div>
            </div>
          </div>

          <div class="mt-3 pt-3 border-t border-gray-200">
            <p class="text-xs text-gray-500 line-clamp-2">
              {{ asociacion.descripcion || 'Sin descripción disponible' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Acciones rápidas -->
      <div class="mt-6 flex flex-wrap gap-2">
        <button
          (click)="seleccionarTodas()"
          class="px-3 py-1 text-sm text-purple-600 bg-purple-100 rounded hover:bg-purple-200 transition-colors">
          Seleccionar Todas
        </button>
        <button
          (click)="limpiarSeleccion()"
          class="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors">
          Limpiar Selección
        </button>
        <button
          (click)="seleccionarMejores()"
          class="px-3 py-1 text-sm text-green-600 bg-green-100 rounded hover:bg-green-200 transition-colors">
          Seleccionar Mejor Calificadas
        </button>
        <button
          (click)="seleccionarActivas()"
          class="px-3 py-1 text-sm text-blue-600 bg-blue-100 rounded hover:bg-blue-200 transition-colors">
          Solo Activas
        </button>
      </div>

      <!-- Información adicional -->
      <div class="mt-6 p-4 bg-gray-50 rounded-lg">
        <h5 class="font-semibold text-gray-800 mb-2">💡 Consejos para el Análisis Comparativo</h5>
        <ul class="text-sm text-gray-600 space-y-1">
          <li>• Seleccione asociaciones de la misma región para comparaciones más precisas</li>
          <li>• Compare asociaciones con características similares (tamaño, antigüedad)</li>
          <li>• El análisis incluirá métricas de rendimiento, fortalezas y oportunidades</li>
          <li>• Los gráficos comparativos facilitarán la identificación de patrones</li>
        </ul>
      </div>
    </div>
  `,
})
export class ComparativoAsociacionesComponent {
  @Input() asociacionesDisponibles: any[] = []
  @Output() asociacionesSeleccionadas = new EventEmitter<number[]>()
  @Output() generarComparativo = new EventEmitter<void>()
  @Output() cerrar = new EventEmitter<void>()

  asociacionesSeleccionadasIds: number[] = []

  isSelected(id: number): boolean {
    return this.asociacionesSeleccionadasIds.includes(id)
  }

  toggleSeleccion(id: number) {
    if (this.isSelected(id)) {
      this.asociacionesSeleccionadasIds = this.asociacionesSeleccionadasIds.filter((selectedId) => selectedId !== id)
    } else {
      this.asociacionesSeleccionadasIds.push(id)
    }
    this.asociacionesSeleccionadas.emit(this.asociacionesSeleccionadasIds)
  }

  deseleccionarAsociacion(id: number) {
    this.asociacionesSeleccionadasIds = this.asociacionesSeleccionadasIds.filter((selectedId) => selectedId !== id)
    this.asociacionesSeleccionadas.emit(this.asociacionesSeleccionadasIds)
  }

  getAsociacionesSeleccionadas() {
    return this.asociacionesDisponibles.filter((asoc) => this.isSelected(asoc.id))
  }

  seleccionarTodas() {
    this.asociacionesSeleccionadasIds = this.asociacionesDisponibles.map((asoc) => asoc.id)
    this.asociacionesSeleccionadas.emit(this.asociacionesSeleccionadasIds)
  }

  limpiarSeleccion() {
    this.asociacionesSeleccionadasIds = []
    this.asociacionesSeleccionadas.emit(this.asociacionesSeleccionadasIds)
  }

  seleccionarMejores() {
    // Seleccionar las 5 asociaciones con mejor calificación
    const mejores = this.asociacionesDisponibles
      .sort((a, b) => (b.calificacion || 0) - (a.calificacion || 0))
      .slice(0, 5)
      .map((asoc) => asoc.id)

    this.asociacionesSeleccionadasIds = mejores
    this.asociacionesSeleccionadas.emit(this.asociacionesSeleccionadasIds)
  }

  seleccionarActivas() {
    const activas = this.asociacionesDisponibles.filter((asoc) => asoc.estado).map((asoc) => asoc.id)

    this.asociacionesSeleccionadasIds = activas
    this.asociacionesSeleccionadas.emit(this.asociacionesSeleccionadasIds)
  }
}
