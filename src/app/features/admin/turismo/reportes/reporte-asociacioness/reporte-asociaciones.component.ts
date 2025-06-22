import { Component, type OnInit, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import {
  ReportesAsociacionesService,
  type FiltrosReporteAsociaciones,
  type OpcionesReporteAsociaciones,
  type DatosFiltrosAsociaciones,
  type PreviewReporteAsociaciones,
} from "../../../../../core/services/reportes-asociaciones.service"
import { LoadingSpinnerComponent } from "../../../../../shared/components/loading-spinner/loading-spinner.component"
import { FiltrosReporteAsociacionesComponent } from "../filtros-reporte-asociaciones/filtros-reporte-asociaciones.component"
import { PreviewReporteAsociacionesComponent } from "../preview-reporte-asociaciones/preview-reporte-asociaciones.component"
import { ComparativoAsociacionesComponent } from "../comparativo-asociaciones/comparativo-asociaciones.component"
import { saveAs } from "file-saver"
import type {OpcionesReporte} from '../../../../../core/services/reportes.service';

@Component({
  selector: "app-reporte-asociaciones",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LoadingSpinnerComponent,
    FiltrosReporteAsociacionesComponent,
    PreviewReporteAsociacionesComponent,
    ComparativoAsociacionesComponent,
  ],
  templateUrl: "./reporte-asociaciones.component.html",
})
export class ReporteAsociacionesExportarComponent implements OnInit {
  private reportesService = inject(ReportesAsociacionesService)

  // Estados del componente
  loading$ = this.reportesService.loading$
  datosFiltros?: DatosFiltrosAsociaciones
  filtrosActuales: FiltrosReporteAsociaciones = {}
  previewReporte?: PreviewReporteAsociaciones
  previsualizando = false
  generandoPDF = false
  errorMessage = ""
  successMessage = ""

  // Opciones de reporte
  opcionesReporte: OpcionesReporteAsociaciones = {
    incluir_estadisticas: true,
    incluir_graficos: false,
    orientacion: "portrait",
    tipo_reporte: "completo",
  }

  // Estado del comparativo
  mostrarComparativo = false
  asociacionesSeleccionadas: number[] = []

  // Información del sistema
  sistemaInfo = {
    nombre: "Sistema de Gestión Turística",
    region: "Lago Titicaca",
    version: "2.0",
  }

  ngOnInit() {
    this.cargarDatosFiltros()
  }

  /**
   * Cargar datos para los filtros
   */
  async cargarDatosFiltros() {
    try {
      this.datosFiltros = await this.reportesService.obtenerDatosFiltros().toPromise()
    } catch (error) {
      console.error("Error al cargar datos de filtros:", error)
      this.mostrarError("Error al cargar los datos de filtros")
    }
  }

  /**
   * Manejar cambio de filtros
   */
  onFiltrosChange(filtros: FiltrosReporteAsociaciones) {
    this.filtrosActuales = filtros
    this.previewReporte = undefined // Limpiar preview anterior
    this.limpiarMensajes()
  }

  /**
   * Previsualizar reporte
   */
  async onPrevisualizar(filtros: FiltrosReporteAsociaciones) {
    this.previsualizando = true
    this.limpiarMensajes()

    try {
      this.previewReporte = await this.reportesService.previsualizarReporte(filtros).toPromise()
      this.mostrarExito("Previsualización generada correctamente")
    } catch (error) {
      console.error("Error al previsualizar reporte:", error)
      this.mostrarError("Error al generar la previsualización")
    } finally {
      this.previsualizando = false
    }
  }

  /**
   * Mostrar/ocultar comparativo
   */
  onMostrarComparativo() {
    this.mostrarComparativo = !this.mostrarComparativo
    if (!this.mostrarComparativo) {
      this.asociacionesSeleccionadas = []
    }
  }

  /**
   * Manejar selección de asociaciones para comparativo
   */
  onAsociacionesSeleccionadas(asociacionesIds: number[]) {
    this.asociacionesSeleccionadas = asociacionesIds
  }

  /**
   * Generar reporte comparativo
   */
  async generarReporteComparativo() {
    if (this.asociacionesSeleccionadas.length < 2) {
      this.mostrarError("Seleccione al menos 2 asociaciones para generar un reporte comparativo")
      return
    }

    try {
      const reporte = await this.reportesService.generarReporteComparativo(this.asociacionesSeleccionadas).toPromise()

      // Aquí podrías mostrar el reporte comparativo en un modal o nueva vista
      console.log("Reporte comparativo:", reporte)
      this.mostrarExito("Reporte comparativo generado correctamente")
    } catch (error) {
      console.error("Error al generar reporte comparativo:", error)
      this.mostrarError("Error al generar el reporte comparativo")
    }
  }

  /**
   * Generar y descargar PDF
   */
  async generarPDF() {
    if (!this.previewReporte || this.previewReporte.total_registros === 0) {
      this.mostrarError("No hay datos para generar el reporte. Aplique filtros y previsualice primero.")
      return
    }

    this.generandoPDF = true
    this.limpiarMensajes()

    try {
      const pdfBlob = await this.reportesService
        .generarReportePDF(this.filtrosActuales, this.opcionesReporte)
        .toPromise()

      if (pdfBlob) {
        const fileName = this.generarNombreArchivo("pdf")
        saveAs(pdfBlob, fileName)
        this.mostrarExito("Reporte PDF generado exitosamente")
      }
    } catch (error) {
      console.error("Error al generar PDF:", error)
      this.mostrarError("Error al generar el reporte PDF")
    } finally {
      this.generandoPDF = false
    }
  }

  /**
   * Imprimir reporte
   */
  async imprimirReporte() {
    if (!this.previewReporte || this.previewReporte.total_registros === 0) {
      this.mostrarError("No hay datos para imprimir. Aplique filtros y previsualice primero.")
      return
    }

    try {
      const pdfBlob = await this.reportesService
        .generarReportePDF(this.filtrosActuales, {
          ...this.opcionesReporte,
          incluir_graficos: false,
        })
        .toPromise()

      if (pdfBlob) {
        const pdfUrl = URL.createObjectURL(pdfBlob)
        const iframe = document.createElement("iframe")
        iframe.style.display = "none"
        iframe.src = pdfUrl

        iframe.onload = () => {
          setTimeout(() => {
            iframe.contentWindow?.print()
            setTimeout(() => {
              document.body.removeChild(iframe)
              URL.revokeObjectURL(pdfUrl)
            }, 100)
          }, 500)
        }

        document.body.appendChild(iframe)
        this.mostrarExito("Preparando reporte para impresión...")
      }
    } catch (error) {
      console.error("Error al imprimir:", error)
      this.mostrarError("Error al preparar el reporte para impresión")
    }
  }

  /**
   * Exportar a Excel (placeholder para futura implementación)
   */
  async exportarExcel() {
    if (!this.previewReporte || this.previewReporte.total_registros === 0) {
      this.mostrarError("No hay datos para exportar")
      return
    }

    try {
      // Implementar cuando esté disponible en el backend
      this.mostrarError("La exportación a Excel estará disponible próximamente")
    } catch (error) {
      console.error("Error al exportar Excel:", error)
      this.mostrarError("Error al exportar a Excel")
    }
  }

  /**
   * Exportar a CSV
   */
  exportarCSV() {
    if (!this.previewReporte?.muestra) {
      this.mostrarError("No hay datos para exportar")
      return
    }

    const csvData = this.previewReporte.muestra.map((asoc) => ({
      Nombre: asoc.nombre,
      Descripción: asoc.descripcion || "",
      Ubicación: asoc.ubicacion || "",
      Municipalidad: asoc.municipalidad || "",
      Teléfono: asoc.telefono || "",
      Email: asoc.email || "",
      Estado: asoc.estado ? "Activo" : "Inactivo",
      Emprendedores: asoc.emprendedores_count || 0,
      Servicios: asoc.servicios_count || 0,
      Calificación: asoc.calificacion || 0,
      "Reservas/Mes": asoc.reservas_mes || 0,
      "Años Operación": asoc.años_operacion || 0,
      "Fecha Creación": asoc.fecha_creacion || "",
    }))

    this.downloadAsCSV(csvData, this.generarNombreArchivo("csv"))
    this.mostrarExito("Archivo CSV descargado correctamente")
  }

  /**
   * Cambiar opciones del reporte
   */
  onOpcionesChange(opciones: Partial<OpcionesReporteAsociaciones>) {
    this.opcionesReporte = { ...this.opcionesReporte, ...opciones };
  }

  onIncluirEstadisticasChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.onOpcionesChange({ incluir_estadisticas: input.checked });
  }

  onOrientacionChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.onOpcionesChange({ orientacion: select.value as 'portrait' | 'landscape' });
  }

  onTipoReporteChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.onOpcionesChange({ tipo_reporte: select.value as 'completo' | 'resumen' | 'comparativo' });
  }

  /**
   * Limpiar todos los filtros y datos
   */
  limpiarTodo() {
    this.filtrosActuales = {}
    this.previewReporte = undefined
    this.mostrarComparativo = false
    this.asociacionesSeleccionadas = []
    this.limpiarMensajes()
    this.mostrarExito("Filtros y datos limpiados")
  }


  /**
   * Utilidades privadas
   */
  private generarNombreArchivo(extension: string): string {
    const fecha = new Date().toISOString().split("T")[0]
    const hora = new Date().toTimeString().split(" ")[0].replace(/:/g, "-")
    return `reporte-asociaciones-${fecha}-${hora}.${extension}`
  }

  private downloadAsCSV(data: any[], filename: string): void {
    if (data.length === 0) return

    const headers = Object.keys(data[0])
    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header] || ""
            return typeof value === "string" && (value.includes(",") || value.includes('"'))
              ? `"${value.replace(/"/g, '""')}"`
              : value
          })
          .join(","),
      ),
    ].join("\n")

    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" })
    saveAs(blob, filename)
  }

  private mostrarError(mensaje: string) {
    this.errorMessage = mensaje
    this.successMessage = ""
    setTimeout(() => (this.errorMessage = ""), 5000)
  }

  private mostrarExito(mensaje: string) {
    this.successMessage = mensaje
    this.errorMessage = ""
    setTimeout(() => (this.successMessage = ""), 3000)
  }

  private limpiarMensajes() {
    this.errorMessage = ""
    this.successMessage = ""
  }

  ultimaActualizacion: string = new Date().toLocaleDateString();

}
