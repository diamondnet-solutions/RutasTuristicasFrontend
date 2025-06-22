import { Injectable } from "@angular/core"
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environments';
import {BehaviorSubject, catchError, Observable} from 'rxjs';
import {map} from 'rxjs/operators';


export interface FiltrosReporteAsociaciones {
  municipalidad?: string
  estado?: boolean
  fecha_desde?: string
  fecha_hasta?: string
  emprendedores_min?: number
  emprendedores_max?: number
  calificacion_min?: number
  calificacion_max?: number
  nombre?: string
  orden_por?: "nombre" | "emprendedores" | "servicios" | "calificacion" | "fecha_creacion"
  direccion?: "asc" | "desc"
  [key: string]: string | number | boolean | undefined; // 👈 ESTA LÍNEA ES CLAVE
}

export interface OpcionesReporteAsociaciones {
  formato?: "pdf" | "excel"
  incluir_estadisticas?: boolean
  incluir_graficos?: boolean
  orientacion?: "portrait" | "landscape"
  tipo_reporte?: "completo" | "resumen" | "comparativo"
}

export interface DatosFiltrosAsociaciones {
  municipalidades: string[]
  rangos_emprendedores: {
    min: number
    max: number
  }
  rangos_calificacion: {
    min: number
    max: number
  }
}

export interface PreviewReporteAsociaciones {
  total_registros: number
  estadisticas: any
  muestra: any[]
  filtros_aplicados: FiltrosReporteAsociaciones
  insights: {
    municipalidad_lider: string
    promedio_emprendedores: number
    calificacion_promedio: number
    porcentaje_activas: number
  }
}

export interface ReporteComparativo {
  asociaciones: any[]
  comparacion: any
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message: string
  errors?: any
}

@Injectable({
  providedIn: "root",
})
export class ReportesAsociacionesService {
  private readonly baseUrl = `${environment.apiUrl}/reportes/asociaciones`
  private loadingSubject = new BehaviorSubject<boolean>(false)
  public loading$ = this.loadingSubject.asObservable()

  constructor(private http: HttpClient) {}

  /**
   * Generar reporte PDF de asociaciones
   */
  generarReportePDF(
    filtros: FiltrosReporteAsociaciones = {},
    opciones: OpcionesReporteAsociaciones = {},
  ): Observable<Blob> {
    this.setLoading(true)

    const body = {
      ...filtros,
      ...opciones,
      formato: "pdf",
    }

    const headers = new HttpHeaders({
      Accept: "application/pdf",
    })

    return this.http
      .post(`${this.baseUrl}/pdf`, body, {
        headers,
        responseType: "blob",
      })
      .pipe(
        map((response: Blob) => {
          this.setLoading(false)
          return response
        }),
        catchError((error) => {
          this.setLoading(false)
          throw error
        }),
      )
  }

  /**
   * Obtener datos para filtros
   */
  obtenerDatosFiltros(): Observable<DatosFiltrosAsociaciones> {
    return this.http
      .get<ApiResponse<DatosFiltrosAsociaciones>>(`${this.baseUrl}/filtros`)
      .pipe(map((response) => response.data))
  }

  /**
   * Previsualizar reporte
   */
  previsualizarReporte(filtros: FiltrosReporteAsociaciones = {}): Observable<PreviewReporteAsociaciones> {
    this.setLoading(true)

    return this.http.post<ApiResponse<PreviewReporteAsociaciones>>(`${this.baseUrl}/preview`, filtros).pipe(
      map((response) => {
        this.setLoading(false)
        return response.data
      }),
      catchError((error) => {
        this.setLoading(false)
        throw error
      }),
    )
  }

  /**
   * Generar reporte comparativo
   */
  generarReporteComparativo(asociacionesIds: number[]): Observable<ReporteComparativo> {
    this.setLoading(true)

    const body = {
      asociaciones_ids: asociacionesIds,
    }

    return this.http.post<ApiResponse<ReporteComparativo>>(`${this.baseUrl}/comparativo`, body).pipe(
      map((response) => {
        this.setLoading(false)
        return response.data
      }),
      catchError((error) => {
        this.setLoading(false)
        throw error
      }),
    )
  }

  /**
   * Generar reporte Excel (futuro)
   */
  generarReporteExcel(filtros: FiltrosReporteAsociaciones = {}): Observable<Blob> {
    this.setLoading(true)

    const body = {
      ...filtros,
      formato: "excel",
    }

    return this.http
      .post(`${this.baseUrl}/excel`, body, {
        responseType: "blob",
      })
      .pipe(
        map((response: Blob) => {
          this.setLoading(false)
          return response
        }),
        catchError((error) => {
          this.setLoading(false)
          throw error
        }),
      )
  }

  private setLoading(loading: boolean): void {
    this.loadingSubject.next(loading)
  }
}
