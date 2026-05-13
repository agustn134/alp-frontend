import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { Navbar } from "../../shared/components/navbar/navbar";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuditService } from '../../core/services/audit';
import { UserService } from '../../core/services/user';
import { AuthService } from '../../core/services/auth.service';
import { Toast } from '../../core/services/toast';

@Component({
  selector: 'app-sala-auditorias',
  standalone: true,
  imports: [Navbar, CommonModule, FormsModule],
  templateUrl: './sala-auditorias.html',
  styleUrl: './sala-auditorias.scss',
})
export class SalaAuditorias implements OnInit {
  private servicioAuditoria = inject(AuditService);
  private servicioUsuarios = inject(UserService);
  private servicioAuth = inject(AuthService);
  private servicioToast = inject(Toast);
  private cdr = inject(ChangeDetectorRef);

  esAdmin = false;
  cargando = true;

  vistaActual: string = 'panel';

  listaUsuarios: any[] = [];
  listaLogs: any[] = [];
  usuarioActual: any = null;

  filtroUsuarios: string = '';
  filtroRol: string = 'TODOS';
  paginaUsuarios: number = 1;

  filtroLogs: string = '';
  paginaLogs: number = 1;
  itemsPorPagina: number = 5;

  mostrarModalEliminar: boolean = false;
  usuarioParaEliminar: any = null;

  mostrarModalReset: boolean = false;
  usuarioParaReset: any = null;
  nuevaPasswordReset: string = '';
  ocultarContrasenaReset: boolean = true;
  errorContrasena: string = '';

  ngOnInit(): void {
    this.verificarRolYCargarDatos();
  }

  cambiarVista(nuevaVista: string, evento: Event) {
    evento.preventDefault();
    this.vistaActual = nuevaVista;
    this.paginaUsuarios = 1;
    this.paginaLogs = 1;
  }

  verificarRolYCargarDatos() {
    this.cargando = true;
    this.servicioAuth.getMe().subscribe({
      next: (usuario) => {
        this.usuarioActual = usuario;
        this.esAdmin = usuario.role === 'ADMIN';
        this.cargarPaneles();
        this.cdr.detectChanges();
      },
      error: () => {
        this.servicioToast.showError('No se pudo identificar al usuario.');
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  cargarPaneles() {
    if (this.esAdmin) {
      this.obtenerDirectorioUsuarios();
      this.obtenerTodosLosLogs();
    } else {
      this.obtenerMisLogs();
    }
  }

  obtenerDirectorioUsuarios() {
    this.servicioUsuarios.getUsers().subscribe({
      next: (usuarios) => {
        this.listaUsuarios = usuarios;
        this.cdr.detectChanges();
      },
      error: (err) => console.error("Error al cargar usuarios", err)
    });
  }

  obtenerTodosLosLogs() {
    this.servicioAuditoria.getAllLogs({}).subscribe({
      next: (logs) => {
        this.listaLogs = logs;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Error al cargar logs generales", err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  obtenerMisLogs() {
    this.servicioAuditoria.getMyLogs().subscribe({
      next: (logs) => {
        this.listaLogs = logs;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Error al cargar logs personales", err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  obtenerClaseIconoLog(severidad: string): string {
    switch (severidad?.toUpperCase()) {
      case 'INFO': return 'bi bi-info-circle-fill text-black';
      case 'ADVERTENCIA': return 'bi bi-person-fill-exclamation text-black';
      case 'CRITICO': return 'bi bi-shield-fill-exclamation text-black';
      case 'ERROR': return 'bi bi-x-octagon-fill text-black';
      case 'EXITO': return 'bi bi-check-circle-fill text-black';
      default: return 'bi bi-hdd-stack-fill text-black';
    }
  }

  get usuariosFiltrados() {
    let filtrados = this.listaUsuarios;

    if (this.filtroRol !== 'TODOS') {
      filtrados = filtrados.filter(u => u.role === this.filtroRol);
    }

    if (this.filtroUsuarios) {
      const busqueda = this.filtroUsuarios.toLowerCase();
      filtrados = filtrados.filter(u =>
        u.name.toLowerCase().includes(busqueda) ||
        u.lastname.toLowerCase().includes(busqueda) ||
        u.username.toLowerCase().includes(busqueda) ||
        u.id.toString().includes(busqueda)
      );
    }
    return filtrados;
  }

  get usuariosFiltradosPaginados() {
    const inicio = (this.paginaUsuarios - 1) * this.itemsPorPagina;
    return this.usuariosFiltrados.slice(inicio, inicio + this.itemsPorPagina);
  }

  get totalPaginasUsuarios() {
    return Math.ceil(this.usuariosFiltrados.length / this.itemsPorPagina);
  }

  cambiarPaginaUsuarios(pagina: number, evento: Event) {
    evento.preventDefault();
    if (pagina >= 1 && pagina <= this.totalPaginasUsuarios) {
      this.paginaUsuarios = pagina;
    }
  }

  get logsFiltrados() {
    if (!this.filtroLogs) return this.listaLogs;
    return this.listaLogs.filter(l =>
      l.action.toLowerCase().includes(this.filtroLogs.toLowerCase()) ||
      (l.error && l.error.toLowerCase().includes(this.filtroLogs.toLowerCase())) ||
      (l.path && l.path.toLowerCase().includes(this.filtroLogs.toLowerCase())) ||
      (l.user_id && l.user_id.toString().includes(this.filtroLogs))
    );
  }

  get logsFiltradosPaginados() {
    const inicio = (this.paginaLogs - 1) * this.itemsPorPagina;
    return this.logsFiltrados.slice(inicio, inicio + this.itemsPorPagina);
  }

  get totalPaginasLogs() {
    return Math.ceil(this.logsFiltrados.length / this.itemsPorPagina);
  }

  cambiarPaginaLogs(pagina: number, evento: Event) {
    evento.preventDefault();
    if (pagina >= 1 && pagina <= this.totalPaginasLogs) {
      this.paginaLogs = pagina;
    }
  }

  obtenerPaginasVisibles(paginaActual: number, totalPaginas: number): (number | string)[] {
    const delta = 1;
    const rango: number[] = [];
    const rangoConPuntos: (number | string)[] = [];
    let l: number | undefined;

    for (let i = 1; i <= totalPaginas; i++) {
      if (i === 1 || i === totalPaginas || (i >= paginaActual - delta && i <= paginaActual + delta)) {
        rango.push(i);
      }
    }

    for (let i of rango) {
      if (l) {
        if (i - l === 2) {
          rangoConPuntos.push(l + 1);
        } else if (i - l !== 1) {
          rangoConPuntos.push('...');
        }
      }
      rangoConPuntos.push(i);
      l = i;
    }

    return rangoConPuntos;
  }

  abrirModalEliminarUsuario(usuario: any) {
    if (usuario.id === this.usuarioActual.id) {
      this.servicioToast.showError('No puedes eliminar tu propio usuario.');
      return;
    }
    this.usuarioParaEliminar = usuario;
    this.mostrarModalEliminar = true;
  }

  cerrarModalEliminarUsuario() {
    this.mostrarModalEliminar = false;
    this.usuarioParaEliminar = null;
  }

  confirmarEliminacionUsuario() {
    if (!this.usuarioParaEliminar) return;

    this.servicioUsuarios.deleteUser(this.usuarioParaEliminar.id).subscribe({
      next: () => {
        this.servicioToast.showSuccess('Usuario eliminado exitosamente.');
        this.obtenerDirectorioUsuarios();
        this.obtenerTodosLosLogs();
        this.cerrarModalEliminarUsuario();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.servicioToast.showError(err.error?.message || 'Hubo un error al intentar eliminar al usuario.');
        this.cerrarModalEliminarUsuario();
        this.cdr.detectChanges();
      }
    });
  }

  cambiarRolUsuario(usuario: any) {
    if (usuario.id === this.usuarioActual.id) {
      this.servicioToast.showError('No puedes cambiar tu propio rol.');
      return;
    }

    const nuevoRol = usuario.role === 'ADMIN' ? 'USER' : 'ADMIN';

    this.servicioUsuarios.updateRole(usuario.id, nuevoRol).subscribe({
      next: () => {
        this.servicioToast.showSuccess(`El usuario ahora tiene rol de ${nuevoRol}.`);
        this.obtenerDirectorioUsuarios();
        this.obtenerTodosLosLogs();
        this.cdr.detectChanges();
      },
      error: () => {
        this.servicioToast.showError('Hubo un error al cambiar el rol.');
        this.cdr.detectChanges();
      }
    });
  }

  abrirModalReset(usuario: any) {
    this.usuarioParaReset = usuario;
    this.nuevaPasswordReset = '';
    this.errorContrasena = '';
    this.ocultarContrasenaReset = true;
    this.mostrarModalReset = true;
  }

  cerrarModalReset() {
    this.mostrarModalReset = false;
    this.usuarioParaReset = null;
    this.nuevaPasswordReset = '';
    this.errorContrasena = '';
  }

  alternarVisibilidadContrasenaReset() {
    this.ocultarContrasenaReset = !this.ocultarContrasenaReset;
  }

  validarContrasenaEnTiempo() {
    if (!this.nuevaPasswordReset) {
      this.errorContrasena = '';
      return;
    }

    if (this.nuevaPasswordReset.length < 8) {
      this.errorContrasena = 'minlength';
      return;
    }

    // (?=.*[a-z]) : al menos una minúscula
    // (?=.*[A-Z]) : al menos una mayúscula
    // (?=.*\d)    : al menos un número
    // (?=.*[^A-Za-z0-9]) : al menos UN carácter especial (cualquiera que no sea letra o número)
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

    if (!regex.test(this.nuevaPasswordReset)) {
      this.errorContrasena = 'pattern';
      return;
    }

    this.errorContrasena = 'valida';
  }

  confirmarResetPassword() {
    if (this.errorContrasena !== 'valida') {
      this.servicioToast.showError('Corrige los errores antes de actualizar.');
      if (!this.nuevaPasswordReset) this.errorContrasena = 'required';
      return;
    }

    this.servicioUsuarios.resetPassword(this.usuarioParaReset.id, this.nuevaPasswordReset).subscribe({
      next: () => {
        this.servicioToast.showSuccess('Contraseña restablecida correctamente');
        this.obtenerTodosLosLogs();
        this.cerrarModalReset();
        this.cdr.detectChanges();
      },
      error: () => {
        this.servicioToast.showError('Error al restablecer la contraseña');
        this.cdr.detectChanges();
      }
    });
  }
}
