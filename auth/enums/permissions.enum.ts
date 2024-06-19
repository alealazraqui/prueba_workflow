import {
  EPermissionsAmos,
  EPermissionsAutorizacionFacturasMiscelaneas,
  EPermissionsDatosMaestros,
  EPermissionsGeneracionFacturasMiscelaneas,
  EPermissionsPayroll,
  EPermissionsRecepcionFacturasClientesCredito,
  EPermissionsRoles,
  EPermissionsSkyledger,
  EPermissionsTiposDeCambio,
  EPermissionsUsers,
} from './modules-permissions.enum';

export type EPermissions =
  | EPermissionsUsers
  | EPermissionsRoles
  | EPermissionsSkyledger
  | EPermissionsTiposDeCambio
  | EPermissionsDatosMaestros
  | EPermissionsAutorizacionFacturasMiscelaneas
  | EPermissionsPayroll
  | EPermissionsRecepcionFacturasClientesCredito
  | EPermissionsGeneracionFacturasMiscelaneas
  | EPermissionsAmos;
