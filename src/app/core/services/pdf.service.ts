import { Injectable } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Asociacion, Emprendedor } from '../models/api.model';

// Forzamos los tipos para evitar errores de compilación
(pdfMake as any).vfs = (pdfFonts as any).vfs;


@Injectable({
  providedIn: 'root'
})
export class PdfService {
  constructor() {}

  /**
   * Genera un reporte PDF de emprendedores
   * @param asociacion Datos de la asociación
   * @param emprendedores Lista de emprendedores
   * @param metrics Métricas calculadas
   */
  generateEmprendedoresReport(
    asociacion: Asociacion,
    emprendedores: Emprendedor[],
    metrics: any
  ): void {
    // Definir el documento
    const docDefinition = this.getEmprendedoresDocDefinition(asociacion, emprendedores, metrics);

    // Generar el PDF
    pdfMake.createPdf(docDefinition).download(
      `Reporte_Emprendedores_${asociacion.nombre}_${new Date().toISOString().split('T')[0]}.pdf`
    );
  }

  /**
   * Crea la definición del documento para el reporte de emprendedores
   */
  private getEmprendedoresDocDefinition(
    asociacion: Asociacion,
    emprendedores: Emprendedor[],
    metrics: any
  ): any {
    return {
      pageSize: 'A4',
      pageOrientation: 'portrait',
      pageMargins: [40, 60, 40, 60],
      header: this.getHeader(asociacion),
      footer: this.getFooter(),
      content: [
        this.getTitle(asociacion),
        this.getMetricsSection(metrics),
        this.getEmprendedoresTable(emprendedores),
        this.getChartsSection(metrics, emprendedores)
      ],
      styles: this.getStyles(),
      defaultStyle: {
        font: 'Helvetica'
      }
    };
  }

  private getHeader(asociacion: Asociacion): any {
    return {
      columns: [
        {
          text: 'Reporte de Emprendedores',
          style: 'header',
          width: '*'
        },
        {
          text: new Date().toLocaleDateString('es-PE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }),
          style: 'headerRight',
          width: 'auto'
        }
      ],
      margin: [40, 20, 40, 0]
    };
  }

  private getFooter(): any {
    return {
      text: '© ' + new Date().getFullYear() + ' - Sistema de Turismo Comunitario',
      alignment: 'center',
      margin: [40, 10, 40, 20],
      style: 'footer'
    };
  }

  private getTitle(asociacion: Asociacion): any {
    return {
      text: `Asociación: ${asociacion.nombre}\nComunidad: ${asociacion.comunidad}`,
      style: 'title',
      margin: [0, 0, 0, 20]
    };
  }

  private getMetricsSection(metrics: any): any {
    return {
      columns: [
        {
          width: '*',
          stack: [
            { text: 'Métricas Generales', style: 'sectionHeader' },
            {
              table: {
                widths: ['*', '*', '*', '*'],
                body: [
                  [
                    { text: 'Total Emprendedores', style: 'metricLabel' },
                    { text: 'Emprendedores Activos', style: 'metricLabel' },
                    { text: 'Con Certificaciones', style: 'metricLabel' },
                    { text: 'Accesibles', style: 'metricLabel' }
                  ],
                  [
                    { text: metrics.total.toString(), style: 'metricValue' },
                    { text: metrics.activos.toString(), style: 'metricValue' },
                    { text: metrics.conCertificaciones.toString(), style: 'metricValue' },
                    { text: metrics.conFacilidadesDiscapacidad.toString(), style: 'metricValue' }
                  ]
                ]
              },
              layout: 'noBorders',
              margin: [0, 5, 0, 20]
            }
          ]
        }
      ]
    };
  }

  private getEmprendedoresTable(emprendedores: Emprendedor[]): any {
    const body = [
      [
        {text: 'Emprendedor', style: 'tableHeader'},
        {text: 'Categoría', style: 'tableHeader'},
        {text: 'Comunidad', style: 'tableHeader'},
        {text: 'Servicios', style: 'tableHeader'},
        {text: 'Reservas/Mes', style: 'tableHeader'},
        {text: 'Estado', style: 'tableHeader'},
        {text: 'Accesible', style: 'tableHeader'}
      ],
      ...emprendedores.map(emp => [
        {text: emp.nombre, style: 'tableCell'},
        {text: emp.categoria, style: 'tableCell'},
        {text: emp.comunidad, style: 'tableCell'},
        {text: emp.servicios_count?.toString() || '0', style: 'tableCell', alignment: 'center'},
        {text: emp.reservas_mes?.toString() || '0', style: 'tableCell', alignment: 'center'},
        {
          text: emp.estado ? 'Activo' : 'Inactivo',
          style: emp.estado ? 'activeStatus' : 'inactiveStatus'
        },
        {
          text: emp.facilidades_discapacidad ? '✓' : '-',
          style: 'tableCell',
          alignment: 'center'
        }
      ])
    ];

    return [
      {
        text: 'Listado de Emprendedores',
        style: 'sectionHeader',
        margin: [0, 0, 0, 10]
      },
      {
        table: {
          headerRows: 1,
          widths: ['*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
          body: body
        },
        layout: {
          hLineWidth: (i: number, node: any) => (i === 0 || i === node.table.body.length) ? 1 : 0,
          vLineWidth: () => 0,
          hLineColor: () => '#cccccc',
          paddingTop: (i: number) => (i === 0) ? 5 : 3,
          paddingBottom: (i: number, node: any) => (i === node.table.body.length - 1) ? 5 : 3
        }
      }
    ];
  }

  private getChartsSection(metrics: any, emprendedores: Emprendedor[]): any {
    // Nota: PDFMake no soporta gráficos nativamente, pero podemos mostrar los datos en tablas
    return [
      { text: 'Distribución por Categoría', style: 'sectionHeader', pageBreak: 'before' },
      {
        table: {
          widths: ['*', 'auto'],
          body: [
            [{ text: 'Categoría', style: 'tableHeader' }, { text: 'Cantidad', style: 'tableHeader' }],
            ...this.getCategoriaData(emprendedores).map(item => [
              { text: item.name, style: 'tableCell' },
              { text: item.value.toString(), style: 'tableCell', alignment: 'center' }
            ])
          ]
        },
        layout: 'lightHorizontalLines',
        margin: [0, 5, 0, 20]
      },
      { text: 'Distribución por Comunidad', style: 'sectionHeader' },
      {
        table: {
          widths: ['*', 'auto'],
          body: [
            [{ text: 'Comunidad', style: 'tableHeader' }, { text: 'Cantidad', style: 'tableHeader' }],
            ...this.getComunidadData(emprendedores).map(item => [
              { text: item.name, style: 'tableCell' },
              { text: item.value.toString(), style: 'tableCell', alignment: 'center' }
            ])
          ]
        },
        layout: 'lightHorizontalLines',
        margin: [0, 5, 0, 20]
      }
    ];
  }

  private getCategoriaData(emprendedores: Emprendedor[]): any[] {
    const categorias: Record<string, number> = {};
    emprendedores.forEach(emp => {
      categorias[emp.categoria] = (categorias[emp.categoria] || 0) + 1;
    });
    return Object.entries(categorias).map(([name, value]) => ({ name, value }));
  }

  private getComunidadData(emprendedores: Emprendedor[]): any[] {
    const comunidades: Record<string, number> = {};
    emprendedores.forEach(emp => {
      comunidades[emp.comunidad] = (comunidades[emp.comunidad] || 0) + 1;
    });
    return Object.entries(comunidades).map(([name, value]) => ({ name, value }));
  }

  private getStyles(): any {
    return {
      header: {
        fontSize: 12,
        bold: true,
        color: '#333333'
      },
      headerRight: {
        fontSize: 10,
        color: '#666666',
        alignment: 'right'
      },
      footer: {
        fontSize: 8,
        color: '#666666'
      },
      title: {
        fontSize: 16,
        bold: true,
        alignment: 'center',
        color: '#2c3e50'
      },
      sectionHeader: {
        fontSize: 14,
        bold: true,
        margin: [0, 10, 0, 5],
        color: '#2c3e50'
      },
      metricLabel: {
        fontSize: 10,
        color: '#666666',
        alignment: 'center'
      },
      metricValue: {
        fontSize: 18,
        bold: true,
        alignment: 'center',
        color: '#3498db'
      },
      tableHeader: {
        fontSize: 10,
        bold: true,
        color: '#ffffff',
        fillColor: '#2c3e50',
        alignment: 'center'
      },
      tableCell: {
        fontSize: 9,
        color: '#333333'
      },
      activeStatus: {
        fontSize: 9,
        color: '#27ae60',
        bold: true,
        alignment: 'center'
      },
      inactiveStatus: {
        fontSize: 9,
        color: '#e74c3c',
        bold: true,
        alignment: 'center'
      }
    };
  }
}
