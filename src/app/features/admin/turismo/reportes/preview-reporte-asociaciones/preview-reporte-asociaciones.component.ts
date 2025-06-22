import { Component, Input } from "@angular/core"
import { CommonModule } from "@angular/common"
import type { PreviewReporteAsociaciones } from "../../../../../core/services/reportes-asociaciones.service"

@Component({
  selector: "app-preview-reporte-asociaciones",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="preview" class="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-bold text-gray-900 flex items-center">
          <svg class="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
          </svg>
          Previsualización del Reporte - Asociaciones
        </h3>

        <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
          {{ preview.total_registros }} asociaciones encontradas
        </span>
      </div>

      <!-- Estadísticas Resumidas -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border-l-4 border-blue-500">
          <div class="text-2xl font-bold text-blue-600">{{ preview.estadisticas.total }}</div>
          <div class="text-sm text-blue-700">Total Asociaciones</div>
        </div>

        <div class="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 border-l-4 border-green-500">
          <div class="text-2xl font-bold text-green-600">{{ preview.estadisticas.total_emprendedores }}</div>
          <div class="text-sm text-green-700">Total Emprendedores</div>
        </div>

        <div class="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4 border-l-4 border-purple-500">
          <div class="text-2xl font-bold text-purple-600">{{ preview.estadisticas.total_servicios }}</div>
          <div class="text-sm text-purple-700">Total Servicios</div>
        </div>

        <div class="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl p-4 border-l-4 border-yellow-500">
          <div class="text-2xl font-bold text-yellow-600">{{ preview.estadisticas.promedio_calificacion }}</div>
          <div class="text-sm text-yellow-700">Calificación Promedio</div>
        </div>
      </div>

      <!-- Métricas Adicionales -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-xl p-4 border-l-4 border-indigo-500">
          <div class="text-xl font-bold text-indigo-600">{{ preview.estadisticas.promedio_emprendedores }}</div>
          <div class="text-sm text-indigo-700">Promedio Emprendedores/Asociación</div>
        </div>

        <div class="bg-gradient-to-r from-pink-50 to-pink-100 rounded-xl p-4 border-l-4 border-pink-500">
          <div class="text-xl font-bold text-pink-600">{{ preview.estadisticas.total_reservas_mes }}</div>
          <div class="text-sm text-pink-700">Reservas Mensuales Totales</div>
        </div>

        <div class="bg-gradient-to-r from-teal-50 to-teal-100 rounded-xl p-4 border-l-4 border-teal-500">
          <div class="text-xl font-bold text-teal-600">{{ preview.estadisticas.porcentaje_activas }}%</div>
          <div class="text-sm text-teal-700">Asociaciones Activas</div>
        </div>
      </div>

      <!-- Distribución por Municipalidad y Estado -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h4 class="text-lg font-semibold text-gray-800 mb-3">Por Municipalidad</h4>
          <div class="space-y-2">
            <div *ngFor="let item of getMunicipalidades()"
                 class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span class="font-medium text-gray-700">{{ item.municipalidad }}</span>
              <div class="flex items-center">
                <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mr-2">
                  {{ item.cantidad }}
                </span>
                <div class="w-16 bg-gray-200 rounded-full h-2">
                  <div class="bg-blue-600 h-2 rounded-full" [style.width.%]="item.porcentaje"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 class="text-lg font-semibold text-gray-800 mb-3">Estado de Asociaciones</h4>
          <div class="space-y-2">
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span class="font-medium text-gray-700 flex items-center">
                <span class="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                Activas
              </span>
              <div class="flex items-center">
                <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium mr-2">
                  {{ preview.estadisticas.asociaciones_activas }}
                </span>
                <div class="w-16 bg-gray-200 rounded-full h-2">
                  <div class="bg-green-600 h-2 rounded-full" [style.width.%]="preview.estadisticas.porcentaje_activas"></div>
                </div>
              </div>
            </div>
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span class="font-medium text-gray-700 flex items-center">
                <span class="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                Inactivas
              </span>
              <div class="flex items-center">
                <span class="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium mr-2">
                  {{ preview.estadisticas.asociaciones_inactivas }}
                </span>
                <div class="w-16 bg-gray-200 rounded-full h-2">
                  <div class="bg-red-600 h-2 rounded-full" [style.width.%]="100 - preview.estadisticas.porcentaje_activas"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Insights Destacados -->
      <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
        <h4 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
          </svg>
          Insights Destacados
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-white rounded-lg p-4 border border-blue-200">
            <h5 class="font-semibold text-blue-900 mb-2">🏆 Municipalidad Líder</h5>
            <p class="text-blue-700 text-sm">
              <strong>{{ preview.insights.municipalidad_lider }}</strong> lidera con la mayor cantidad de asociaciones registradas
            </p>
          </div>
          <div class="bg-white rounded-lg p-4 border border-purple-200">
            <h5 class="font-semibold text-purple-900 mb-2">⭐ Calidad Promedio</h5>
            <p class="text-purple-700 text-sm">
              Las asociaciones mantienen una calificación promedio de <strong>{{ preview.insights.calificacion_promedio }}</strong> estrellas
            </p>
          </div>
          <div class="bg-white rounded-lg p-4 border border-green-200">
            <h5 class="font-semibold text-green-900 mb-2">👥 Emprendedores</h5>
            <p class="text-green-700 text-sm">
              Promedio de <strong>{{ preview.insights.promedio_emprendedores }}</strong> emprendedores por asociación
            </p>
          </div>
          <div class="bg-white rounded-lg p-4 border border-yellow-200">
            <h5 class="font-semibold text-yellow-900 mb-2">📈 Estado General</h5>
            <p class="text-yellow-700 text-sm">
              <strong>{{ preview.insights.porcentaje_activas }}%</strong> de las asociaciones se encuentran activas
            </p>
          </div>
        </div>
      </div>

      <!-- Muestra de Datos -->
      <div>
        <h4 class="text-lg font-semibold text-gray-800 mb-3">Muestra de Datos (Primeras 5 asociaciones)</h4>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Asociación
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ubicación
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Emprendedores
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Servicios
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Calificación
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reservas/Mes
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let asociacion of preview.muestra">
                <td class="px-4 py-3 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ asociacion.nombre }}</div>
                  <div class="text-sm text-gray-500">{{ asociacion.descripcion | slice:0:50 }}...</div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ asociacion.ubicacion }}</div>
                  <div class="text-sm text-gray-500">{{ asociacion.municipalidad }}</div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <span [class]="asociacion.estado ? 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800' : 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800'">
                    {{ asociacion.estado ? 'Activa' : 'Inactiva' }}
                  </span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {{ asociacion.emprendedores_count }}
                  </span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {{ asociacion.servicios_count }}
                  </span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                  <div class="flex items-center">
                    <span class="text-yellow-400 mr-1">⭐</span>
                    <span>{{ asociacion.calificacion }}</span>
                  </div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                  {{ asociacion.reservas_mes }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Nota informativa -->
      <div class="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
        <div class="flex">
          <svg class="w-5 h-5 text-blue-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
          </svg>
          <div>
            <p class="text-sm text-blue-700">
              Esta es una previsualización de los datos que se incluirán en el reporte.
              El reporte completo contendrá todas las {{ preview.total_registros }} asociaciones encontradas con análisis detallado y gráficos estadísticos.
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class PreviewReporteAsociacionesComponent {
  @Input() preview?: PreviewReporteAsociaciones

  getMunicipalidades() {
    if (!this.preview?.estadisticas?.por_municipalidad || this.preview.estadisticas.total === undefined) {
      return [];
    }

    const total = this.preview.estadisticas.total;
    return Object.entries(this.preview.estadisticas.por_municipalidad as Record<string, number>).map(([municipalidad, cantidad]) => ({
      municipalidad,
      cantidad,
      porcentaje: Math.round((cantidad as number / total) * 100),
    }));
  }
}
