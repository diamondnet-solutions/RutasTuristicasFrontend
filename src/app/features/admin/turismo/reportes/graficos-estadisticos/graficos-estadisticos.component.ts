import {
  Component,
  Input,
  type OnInit,
  type OnDestroy,
  type AfterViewInit,
  ViewChild,
  type ElementRef,
} from "@angular/core"
import { CommonModule } from "@angular/common"
import type { ChartService, ChartData } from "../../../../../core/services/chart.service"
import type { PreviewReporte } from "../../../../../core/services/reportes.service"

@Component({
  selector: "app-graficos-estadisticos",
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
          Gráficos Estadísticos
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
        <p>Previsualice un reporte para ver los gráficos estadísticos</p>
      </div>

      <div *ngIf="preview" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Gráfico de Categorías -->
        <div class="bg-gray-50 rounded-xl p-4">
          <h4 class="text-lg font-semibold text-gray-800 mb-4 text-center">
            Distribución por Categoría
          </h4>
          <div class="relative h-80">
            <canvas #categoriasChart id="categoriasChart"></canvas>
          </div>
        </div>

        <!-- Gráfico de Municipalidades -->
        <div class="bg-gray-50 rounded-xl p-4">
          <h4 class="text-lg font-semibold text-gray-800 mb-4 text-center">
            Emprendedores por Municipalidad
          </h4>
          <div class="relative h-80">
            <canvas #municipalidadesChart id="municipalidadesChart"></canvas>
          </div>
        </div>

        <!-- Gráfico de Certificaciones -->
        <div class="bg-gray-50 rounded-xl p-4">
          <h4 class="text-lg font-semibold text-gray-800 mb-4 text-center">
            Estado de Certificaciones
          </h4>
          <div class="relative h-80">
            <canvas #certificacionesChart id="certificacionesChart"></canvas>
          </div>
        </div>

        <!-- Gráfico de Facilidades -->
        <div class="bg-gray-50 rounded-xl p-4">
          <h4 class="text-lg font-semibold text-gray-800 mb-4 text-center">
            Facilidades de Accesibilidad
          </h4>
          <div class="relative h-80">
            <canvas #facilidadesChart id="facilidadesChart"></canvas>
          </div>
        </div>

        <!-- Gráfico de Reservas por Categoría -->
        <div class="bg-gray-50 rounded-xl p-4 lg:col-span-2">
          <h4 class="text-lg font-semibold text-gray-800 mb-4 text-center">
            Reservas Mensuales por Categoría
          </h4>
          <div class="relative h-80">
            <canvas #reservasChart id="reservasChart"></canvas>
          </div>
        </div>
      </div>

      <!-- Resumen de Insights -->
      <div *ngIf="preview" class="mt-6 bg-blue-50 rounded-xl p-6">
        <h4 class="text-lg font-semibold text-blue-900 mb-4">📈 Insights Estadísticos</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div class="bg-white rounded-lg p-4">
            <h5 class="font-semibold text-gray-800 mb-2">Categoría Dominante</h5>
            <p class="text-gray-600">
              <strong>{{ categoriaDominante?.categoria }}</strong> representa el
              <strong>{{ categoriaDominante?.porcentaje }}%</strong> del total
            </p>
          </div>
          <div class="bg-white rounded-lg p-4">
            <h5 class="font-semibold text-gray-800 mb-2">Nivel de Certificación</h5>
            <p class="text-gray-600">
              <strong>{{ preview.estadisticas.porcentaje_certificaciones }}%</strong>
              de los emprendedores cuentan con certificaciones
            </p>
          </div>
          <div class="bg-white rounded-lg p-4">
            <h5 class="font-semibold text-gray-800 mb-2">Accesibilidad</h5>
            <p class="text-gray-600">
              <strong>{{ preview.estadisticas.porcentaje_facilidades }}%</strong>
              ofrecen facilidades para personas con discapacidad
            </p>
          </div>
          <div class="bg-white rounded-lg p-4">
            <h5 class="font-semibold text-gray-800 mb-2">Actividad Promedio</h5>
            <p class="text-gray-600">
              <strong>{{ preview.estadisticas.promedio_reservas }}</strong>
              reservas promedio por emprendedor al mes
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class GraficosEstadisticosComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() preview?: PreviewReporte
  @ViewChild("categoriasChart") categoriasChartRef!: ElementRef<HTMLCanvasElement>
  @ViewChild("municipalidadesChart") municipalidadesChartRef!: ElementRef<HTMLCanvasElement>
  @ViewChild("certificacionesChart") certificacionesChartRef!: ElementRef<HTMLCanvasElement>
  @ViewChild("facilidadesChart") facilidadesChartRef!: ElementRef<HTMLCanvasElement>
  @ViewChild("reservasChart") reservasChartRef!: ElementRef<HTMLCanvasElement>

  categoriaDominante?: { categoria: string; porcentaje: string }

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

    this.crearGraficoCategorias()
    this.crearGraficoMunicipalidades()
    this.crearGraficoCertificaciones()
    this.crearGraficoFacilidades()
    this.crearGraficoReservas()
    this.calcularInsights()
  }

  private crearGraficoCategorias() {
    const categorias = this.preview!.estadisticas.por_categoria as Record<string, number>
    const labels = Object.keys(categorias)
    const data = Object.values(categorias)
    const colors = this.chartService.getChartColors(labels.length)

    const chartData: ChartData = {
      labels,
      datasets: [
        {
          label: "Emprendedores",
          data,
          backgroundColor: this.chartService.getChartColorsWithAlpha(labels.length, 0.8),
          borderColor: colors,
          borderWidth: 2,
        },
      ],
    }

    this.chartService.createDoughnutChart("categoriasChart", chartData)
  }

  private crearGraficoMunicipalidades() {
    const municipalidades = this.preview!.estadisticas.por_municipalidad as Record<string, number>
    const labels = Object.keys(municipalidades)
    const data = Object.values(municipalidades)
    const colors = this.chartService.getChartColors(labels.length)

    const chartData: ChartData = {
      labels,
      datasets: [
        {
          label: "Emprendedores",
          data,
          backgroundColor: this.chartService.getChartColorsWithAlpha(labels.length, 0.8),
          borderColor: colors,
          borderWidth: 2,
        },
      ],
    }

    this.chartService.createBarChart("municipalidadesChart", chartData, {
      plugins: {
        legend: {
          display: false,
        },
      },
    })
  }

  private crearGraficoCertificaciones() {
    const conCertificaciones = this.preview!.estadisticas.con_certificaciones
    const sinCertificaciones = this.preview!.estadisticas.total - conCertificaciones

    const chartData: ChartData = {
      labels: ["Con Certificaciones", "Sin Certificaciones"],
      datasets: [
        {
          label: "Emprendedores",
          data: [conCertificaciones, sinCertificaciones],
          backgroundColor: ["#10B981", "#EF4444"],
          borderColor: ["#059669", "#DC2626"],
          borderWidth: 2,
        },
      ],
    }

    this.chartService.createDoughnutChart("certificacionesChart", chartData)
  }

  private crearGraficoFacilidades() {
    const conFacilidades = this.preview!.estadisticas.con_facilidades_discapacidad
    const sinFacilidades = this.preview!.estadisticas.total - conFacilidades

    const chartData: ChartData = {
      labels: ["Con Facilidades", "Sin Facilidades"],
      datasets: [
        {
          label: "Emprendedores",
          data: [conFacilidades, sinFacilidades],
          backgroundColor: ["#8B5CF6", "#6B7280"],
          borderColor: ["#7C3AED", "#4B5563"],
          borderWidth: 2,
        },
      ],
    }

    this.chartService.createDoughnutChart("facilidadesChart", chartData)
  }

  private crearGraficoReservas() {
    // Calcular reservas por categoría basado en la muestra
    const reservasPorCategoria: Record<string, number> = {}

    this.preview!.muestra.forEach((emp) => {
      const categoria = emp.categoria || "Sin categoría"
      reservasPorCategoria[categoria] = (reservasPorCategoria[categoria] || 0) + (emp.reservas_mes || 0)
    })

    const labels = Object.keys(reservasPorCategoria)
    const data = Object.values(reservasPorCategoria)
    const colors = this.chartService.getChartColors(labels.length)

    const chartData: ChartData = {
      labels,
      datasets: [
        {
          label: "Reservas Mensuales",
          data,
          backgroundColor: this.chartService.getChartColorsWithAlpha(labels.length, 0.8),
          borderColor: colors,
          borderWidth: 2,
        },
      ],
    }

    this.chartService.createBarChart("reservasChart", chartData, {
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
            text: "Número de Reservas",
          },
        },
        x: {
          title: {
            display: true,
            text: "Categorías",
          },
        },
      },
    })
  }

  private calcularInsights() {
    const categorias = this.preview!.estadisticas.por_categoria
    const total = this.preview!.estadisticas.total

    // Encontrar categoría dominante
    let maxCategoria = ""
    let maxCantidad = 0

    Object.entries(categorias).forEach(([categoria, cantidad]) => {
      const cantidadNum = cantidad as number;
      if (cantidadNum > maxCantidad) {
        maxCantidad = cantidadNum;
        maxCategoria = categoria;
      }
    });

    this.categoriaDominante = {
      categoria: maxCategoria,
      porcentaje: ((maxCantidad / total) * 100).toFixed(1),
    }
  }

  async exportarGraficos() {
    try {
      const graficos = [
        { id: "categoriasChart", nombre: "categorias" },
        { id: "municipalidadesChart", nombre: "municipalidades" },
        { id: "certificacionesChart", nombre: "certificaciones" },
        { id: "facilidadesChart", nombre: "facilidades" },
        { id: "reservasChart", nombre: "reservas" },
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
