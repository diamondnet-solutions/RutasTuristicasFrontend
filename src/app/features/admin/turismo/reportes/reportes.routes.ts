/**
 * Nombre del archivo: reportes.routes.ts
 *
 * Propósito: Definir las rutas para los diferentes componentes de reportes en el módulo correspondiente.
 *
 * Autor: Eliazar Noa Llascanoa
 *
 * Fecha de creación: 01-06-2025
 */

import { Routes } from '@angular/router';

import { ReporteEmprendedoresExportarComponent } from './reporte-emprendedoress/reporte-emprendedores.component';
import { ReporteEmprendedoresComponent } from './reporte-emprendedores/reporte-emprendedores.component';

import { ReporteAsociacionesComponent } from './reporte-asociaciones/reporte-asociaciones.component';
import { ReporteAsociacionesExportarComponent } from './reporte-asociacioness/reporte-asociaciones.component';

import { ReporteLugaresComponent } from './reporte-lugares/reporte-lugares.component';

/**
 * Arreglo de rutas para la sección de reportes.
 * Cada ruta está asociada a un componente específico encargado de renderizar el contenido correspondiente.
 */
export const REPORTES_ROUTES: Routes = [
  {
    path: 'emprendedores/dashboard',
    component: ReporteEmprendedoresComponent
  },
  {
    path: 'emprendedores/exportar',
    component: ReporteEmprendedoresExportarComponent
  },
  {
    path: 'asociaciones/dashboard',
    component: ReporteAsociacionesComponent
  },
  {
    path: 'asociaciones/exportar',
    component: ReporteAsociacionesExportarComponent
  },
  {
    path: 'lugares/dashboard',
    component: ReporteLugaresComponent
  },
  {
    path: 'lugares/exportar',
    component: ReporteLugaresComponent
  }
];
