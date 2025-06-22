import { Injectable } from "@angular/core"
import { Chart, ChartConfiguration, ChartType, registerables } from "chart.js"

// Registrar todos los componentes de Chart.js
Chart.register(...registerables)

export interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string[]
    borderColor?: string[]
    borderWidth?: number
  }[]
}

export interface ChartOptions {
  responsive?: boolean
  maintainAspectRatio?: boolean
  plugins?: any
  scales?: any
}

@Injectable({
  providedIn: "root",
})
export class ChartService {
  private charts: Map<string, Chart> = new Map()

  /**
   * Crear un gráfico de barras
   */
  createBarChart(canvasId: string, data: ChartData, options: ChartOptions = {}): Chart {
    return this.createChart(canvasId, "bar", data, {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
        tooltip: {
          enabled: true,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          titleColor: "white",
          bodyColor: "white",
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: "rgba(0, 0, 0, 0.1)",
          },
        },
        x: {
          grid: {
            display: false,
          },
        },
      },
      ...options,
    })
  }

  /**
   * Crear un gráfico de dona/pie
   */
  createDoughnutChart(canvasId: string, data: ChartData, options: ChartOptions = {}): Chart {
    return this.createChart(canvasId, "doughnut", data, {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: "right",
        },
        tooltip: {
          enabled: true,
          callbacks: {
            label: (context: any) => {
              const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
              const percentage = ((context.parsed * 100) / total).toFixed(1)
              return `${context.label}: ${context.parsed} (${percentage}%)`
            },
          },
        },
      },
      ...options,
    })
  }

  /**
   * Crear un gráfico de líneas
   */
  createLineChart(canvasId: string, data: ChartData, options: ChartOptions = {}): Chart {
    return this.createChart(canvasId, "line", data, {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: "rgba(0, 0, 0, 0.1)",
          },
        },
        x: {
          grid: {
            display: false,
          },
        },
      },
      ...options,
    })
  }

  /**
   * Crear gráfico base
   */
  private createChart(canvasId: string, type: ChartType, data: ChartData, options: ChartOptions): Chart {
    // Destruir gráfico existente si existe
    this.destroyChart(canvasId)

    const canvas = document.getElementById(canvasId) as HTMLCanvasElement
    if (!canvas) {
      throw new Error(`Canvas with id '${canvasId}' not found`)
    }

    const config: ChartConfiguration = {
      type,
      data,
      options,
    }

    const chart = new Chart(canvas, config)
    this.charts.set(canvasId, chart)

    return chart
  }

  /**
   * Actualizar datos de un gráfico existente
   */
  updateChart(canvasId: string, data: ChartData): void {
    const chart = this.charts.get(canvasId)
    if (chart) {
      chart.data = data
      chart.update()
    }
  }

  /**
   * Destruir un gráfico específico
   */
  destroyChart(canvasId: string): void {
    const chart = this.charts.get(canvasId)
    if (chart) {
      chart.destroy()
      this.charts.delete(canvasId)
    }
  }

  /**
   * Destruir todos los gráficos
   */
  destroyAllCharts(): void {
    this.charts.forEach((chart) => chart.destroy())
    this.charts.clear()
  }

  /**
   * Generar imagen base64 de un gráfico para PDF
   */
  async generateChartImage(canvasId: string): Promise<string> {
    const chart = this.charts.get(canvasId)
    if (!chart) {
      throw new Error(`Chart with id '${canvasId}' not found`)
    }

    return chart.toBase64Image("image/png", 1.0)
  }

  /**
   * Obtener colores predefinidos para gráficos
   */
  getChartColors(count: number): string[] {
    const colors = [
      "#3B82F6", // Blue
      "#10B981", // Green
      "#F59E0B", // Yellow
      "#EF4444", // Red
      "#8B5CF6", // Purple
      "#06B6D4", // Cyan
      "#F97316", // Orange
      "#84CC16", // Lime
      "#EC4899", // Pink
      "#6B7280", // Gray
    ]

    // Repetir colores si se necesitan más
    const result = []
    for (let i = 0; i < count; i++) {
      result.push(colors[i % colors.length])
    }

    return result
  }

  /**
   * Generar colores con transparencia
   */
  getChartColorsWithAlpha(count: number, alpha = 0.8): string[] {
    return this.getChartColors(count).map((color) => {
      // Convertir hex a rgba
      const r = Number.parseInt(color.slice(1, 3), 16)
      const g = Number.parseInt(color.slice(3, 5), 16)
      const b = Number.parseInt(color.slice(5, 7), 16)
      return `rgba(${r}, ${g}, ${b}, ${alpha})`
    })
  }
}
