import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from "@angular/core"
import { CommonModule } from "@angular/common"
import { ChartService, ChartData } from "../../../../../core/services/chart.service"
import { PreviewReporteAsociaciones } from "../../../../../core/services/reportes-asociaciones.service"

@Component({
  selector: "app-graficos-estadisticos-asociaciones",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-bold text-gray-900 flex items-center">
          <svg class="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
          Gráficos Estadísticos - Asociaciones
        </h3>

        <div class="flex gap-2">
          <button
            (click)="exportarGraficos()"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
            📊 Exportar Gráficos
          </button>
        </div>
      </div>

      <div *ngIf="!preview" class="text-center py-12 text-gray-500">
        <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
        </svg>
        <p>Previsualice un reporte para ver los gráficos estadísticos de asociaciones</p>
      </div>

      <div *ngIf="preview" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Gráfico de Municipalidades -->
        <div class="bg-gray-50 rounded-xl p-4">
          <h4 class="text-lg font-semibold text-gray-800 mb-4 text-center">
            Distribución por Municipalidad
          </h4>
          <div class="relative h-80">
            <canvas #municipalidadesChart id="municipalidadesChartAsoc"></canvas>
          </div>
        </div>

        <!-- Gráfico de Estado -->
        <div class="bg-gray-50 rounded-xl p-4">
          <h4 class="text-lg font-semibold text-gray-800 mb-4 text-center">
            Estado de Asociaciones
          </h4>
          <div class="relative h-80">
            <canvas #estadoChart id="estadoChartAsoc"></canvas>
          </div>
        </div>

        <!-- Gráfico de Distribución de Emprendedores -->
        <div class="bg-gray-50 rounded-xl p-4">
          <h4 class="text-lg font-semibold text-gray-800 mb-4 text-center">
            Distribución por Número de Emprendedores
          </h4>
          <div class="relative h-80">
            <canvas #emprendedoresChart id="emprendedoresChartAsoc"></canvas>
          </div>
        </div>

        <!-- Gráfico de Calificaciones -->
        <div class="bg-gray-50 rounded-xl p-4">
          <h4 class="text-lg font-semibold text-gray-800 mb-4 text-center">
            Distribución de Calificaciones
          </h4>
          <div class="relative h-80">
            <canvas #calificacionesChart id="calificacionesChartAsoc"></canvas>
          </div>
        </div>

        <!-- Gráfico de Evolución Temporal -->
        <div class="bg-gray-50 rounded-xl p-4 lg:col-span-2">
          <h4 class="text-lg font-semibold text-gray-800 mb-4 text-center">
            Evolución Temporal de Creación de Asociaciones
          </h4>
          <div class="relative h-80">
            <canvas #evolucionChart id="evolucionChartAsoc"></canvas>
          </div>
        </div>
      </div>

      <!-- Resumen de Insights -->
      <div *ngIf="preview" class="mt-6 bg-blue-50 rounded-xl p-6">
        <h4 class="text-lg font-semibold text-blue-900 mb-4">📈 Insights Estadísticos</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div class="bg-white rounded-lg p-4">
            <h5 class="font-semibold text-gray-800 mb-2">Municipalidad Líder</h5>
            <p class="text-gray-600">
              <strong>{{ municipalidadLider?.municipalidad }}</strong> con
              <strong>{{ municipalidadLider?.cantidad }}</strong> asociaciones
              ({{ municipalidadLider?.porcentaje }}%)
            </p>
          </div>
          <div class="bg-white rounded-lg p-4">
            <h5 class="font-semibold text-gray-800 mb-2">Nivel de Actividad</h5>
            <p class="text-gray-600">
              <strong>{{ preview.estadisticas.porcentaje_activas }}%</strong>
              de las asociaciones están activas
            </p>
          </div>
          <div class="bg-white rounded-lg p-4">
            <h5 class="font-semibold text-gray-800 mb-2">Promedio de Emprendedores</h5>
            <p class="text-gray-600">
              <strong>{{ preview.estadisticas.promedio_emprendedores }}</strong>
              emprendedores por asociación
            </p>
          </div>
          <div class="bg-white rounded-lg p-4">
            <h5 class="font-semibold text-gray-800 mb-2">Calificación General</h5>
            <p class="text-gray-600">
              Promedio de <strong>{{ preview.estadisticas.promedio_calificacion }}</strong>
              estrellas en el sistema
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class GraficosEstadisticosAsociacionesComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() preview?: PreviewReporteAsociaciones
  @ViewChild("municipalidadesChart") municipalidadesChartRef!: ElementRef<HTMLCanvasElement>
  @ViewChild("estadoChart") estadoChartRef!: ElementRef<HTMLCanvasElement>
  @ViewChild("emprendedoresChart") emprendedoresChartRef!: ElementRef<HTMLCanvasElement>
  @ViewChild("calificacionesChart") calificacionesChartRef!: ElementRef<HTMLCanvasElement>
  @ViewChild("evolucionChart") evolucionChartRef!: ElementRef<HTMLCanvasElement>

  municipalidadLider?: { municipalidad: string; cantidad: number; porcentaje: string }

  constructor(private chartService: ChartService) {}

  ngOnInit() {
    // Inicialización si es necesaria
  }

  ngAfterViewInit() {
    // Crear gráficos después de que la vista esté inicializada
    if (this.preview) {
      setTimeout(() => this.crearGraficos(), 100)
    }
  }

  ngOnDestroy() {
    // Limpiar gráficos al destruir el componente
    this.chartService.destroyAllCharts()
  }

  ngOnChanges() {
    // Recrear gráficos cuando cambien los datos
    if (this.preview) {
      setTimeout(() => this.crearGraficos(), 100)
    }
  }

  private crearGraficos() {
    if (!this.preview) return

    this.crearGraficoMunicipalidades()
    this.crearGraficoEstado()
    this.crearGraficoDistribucionEmprendedores()
    this.crearGraficoCalificaciones()
    this.crearGraficoEvolucionTemporal()
    this.calcularInsights()
  }

  private crearGraficoMunicipalidades() {
    const municipalidades = this.preview!.estadisticas.por_municipalidad as Record<string, number>
    const labels = Object.keys(municipalidades)
    const data = Object.values(municipalidades) as number[];
    const colors = this.chartService.getChartColors(labels.length);

    const chartData: ChartData = {
      labels,
      datasets: [
        {
          label: "Asociaciones",
          data,
          backgroundColor: this.chartService.getChartColorsWithAlpha(labels.length, 0.8),
          borderColor: colors,
          borderWidth: 2,
        },
      ],
    }

    this.chartService.createBarChart("municipalidadesChartAsoc", chartData, {
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Número de Asociaciones",
          },
        },
        x: {
          title: {
            display: true,
            text: "Municipalidades",
          },
        },
      },
    })
  }

  private crearGraficoEstado() {
    const activas = this.preview!.estadisticas.asociaciones_activas
    const inactivas = this.preview!.estadisticas.asociaciones_inactivas

    const chartData: ChartData = {
      labels: ["Activas", "Inactivas"],
      datasets: [
        {
          label: "Asociaciones",
          data: [activas, inactivas],
          backgroundColor: ["#10B981", "#EF4444"],
          borderColor: ["#059669", "#DC2626"],
          borderWidth: 2,
        },
      ],
    }

    this.chartService.createDoughnutChart("estadoChartAsoc", chartData)
  }

  private crearGraficoDistribucionEmprendedores() {
    // Agrupar asociaciones por rangos de emprendedores
    const rangos = {
      "1-5": 0,
      "6-10": 0,
      "11-20": 0,
      "21-50": 0,
      "50+": 0,
    }

    this.preview!.muestra.forEach((asociacion) => {
      const count = asociacion.emprendedores_count || 0

      if (count <= 5) {
        rangos["1-5"]++
      } else if (count <= 10) {
        rangos["6-10"]++
      } else if (count <= 20) {
        rangos["11-20"]++
      } else if (count <= 50) {
        rangos["21-50"]++
      } else {
        rangos["50+"]++
      }
    })

    const chartData: ChartData = {
      labels: Object.keys(rangos),
      datasets: [
        {
          label: "Asociaciones",
          data: Object.values(rangos),
          backgroundColor: this.chartService.getChartColorsWithAlpha(5, 0.8),
          borderColor: this.chartService.getChartColors(5),
          borderWidth: 2,
        },
      ],
    }

    this.chartService.createDoughnutChart("emprendedoresChartAsoc", chartData, {
      plugins: {
        legend: {
          position: "right",
        },
        title: {
          display: true,
          text: "Distribución por Número de Emprendedores",
        },
      },
    })
  }

  private crearGraficoCalificaciones() {
    // Agrupar por rangos de calificación
    const rangos = {
      "4.5-5.0": 0,
      "4.0-4.4": 0,
      "3.5-3.9": 0,
      "3.0-3.4": 0,
      "< 3.0": 0,
    }

    this.preview!.muestra.forEach((asociacion) => {
      const calificacion = asociacion.calificacion || 0

      if (calificacion >= 4.5) {
        rangos["4.5-5.0"]++
      } else if (calificacion >= 4.0) {
        rangos["4.0-4.4"]++
      } else if (calificacion >= 3.5) {
        rangos["3.5-3.9"]++
      } else if (calificacion >= 3.0) {
        rangos["3.0-3.4"]++
      } else {
        rangos["< 3.0"]++
      }
    })

    const chartData: ChartData = {
      labels: Object.keys(rangos),
      datasets: [
        {
          label: "Asociaciones",
          data: Object.values(rangos),
          backgroundColor: ["#10B981", "#3B82F6", "#F59E0B", "#F97316", "#EF4444"],
          borderWidth: 2,
        },
      ],
    }

    this.chartService.createBarChart("calificacionesChartAsoc", chartData, {
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Número de Asociaciones",
          },
        },
        x: {
          title: {
            display: true,
            text: "Rango de Calificación",
          },
        },
      },
    })
  }

  private crearGraficoEvolucionTemporal() {
    // Simular datos de evolución temporal basados en la muestra
    const aniosCreacion: Record<string, number> = {}
    this.preview!.muestra.forEach((asociacion) => {
      if (asociacion.fecha_creacion) {
        const anio = new Date(asociacion.fecha_creacion).getFullYear().toString()
        aniosCreacion[anio] = (aniosCreacion[anio] || 0) + 1
      }
    })

    const aniosOrdenados = Object.keys(aniosCreacion).sort()
    const datos = aniosOrdenados.map((anio) => aniosCreacion[anio])

    const chartData: ChartData = {
      labels: aniosOrdenados,
      datasets: [
        {
          label: "Asociaciones Creadas",
          data: datos,
          backgroundColor: Array(datos.length).fill("rgba(59, 130, 246, 0.1)"),
          borderColor: Array(datos.length).fill("#3B82F6"),
          borderWidth: 3,
        },
      ],
    }

    this.chartService.createLineChart("evolucionChartAsoc", chartData, {
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Número de Asociaciones",
          },
        },
        x: {
          title: {
            display: true,
            text: "Año de Creación",
          },
        },
      },
    })
  }

  private calcularInsights() {
    const municipalidades = this.preview!.estadisticas.por_municipalidad
    const total = this.preview!.estadisticas.total

    // Encontrar municipalidad líder
    let maxMunicipalidad = ""
    let maxCantidad = 0

    Object.entries(municipalidades).forEach(([municipalidad, cantidad]) => {
      const cantidadNumber = cantidad as number
      if (cantidadNumber > maxCantidad) {
        maxCantidad = cantidadNumber
        maxMunicipalidad = municipalidad
      }
    })

    this.municipalidadLider = {
      municipalidad: maxMunicipalidad,
      cantidad: maxCantidad,
      porcentaje: ((maxCantidad / total) * 100).toFixed(1),
    }
  }

  async exportarGraficos() {
    try {
      const graficos = [
        { id: "municipalidadesChartAsoc", nombre: "municipalidades-asociaciones" },
        { id: "estadoChartAsoc", nombre: "estado-asociaciones" },
        { id: "emprendedoresChartAsoc", nombre: "distribucion-emprendedores" },
        { id: "calificacionesChartAsoc", nombre: "calificaciones-asociaciones" },
        { id: "evolucionChartAsoc", nombre: "evolucion-temporal" },
      ]

      for (const grafico of graficos) {
        try {
          const imageData = await this.chartService.generateChartImage(grafico.id)
          this.downloadImage(imageData, `grafico-${grafico.nombre}.png`)
        } catch (error) {
          console.error(`Error al exportar gráfico ${grafico.nombre}:`, error)
        }
      }
    } catch (error) {
      console.error("Error al exportar gráficos:", error)
    }
  }

  private downloadImage(dataUrl: string, filename: string) {
    const link = document.createElement("a")
    link.download = filename
    link.href = dataUrl
    link.click()
  }
}
