import { EventEmitter, Injectable } from '@angular/core';
import { Usuario } from 'src/app/models/Usuario/usuario';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public userLogged? : Usuario;
  registro : EventEmitter<Usuario> = new EventEmitter<Usuario>();
  usuarioYaRegistrado : EventEmitter<string> = new EventEmitter<string>();
  sesionIniciada : EventEmitter<Usuario> = new EventEmitter<Usuario>();
  errorInicioDeSesion : EventEmitter<string> = new EventEmitter<string> ();
  sesionTerminada : EventEmitter<boolean> = new EventEmitter<boolean>();
  errorRegistro : EventEmitter<string> = new EventEmitter<string>();

  private collectionUsr : string = "users";

  constructor(private db: AngularFirestore, private auth : AngularFireAuth) { }

  actualizarUsuario ( usuario : Usuario ) {
    return this.db.collection( this.collectionUsr ).doc( usuario.email ).update ( {...usuario} );
  }

  obtenerTodosLosUsuarios () {
    return this.db.collection( this.collectionUsr ).get().pipe(
      map( (usuarios) => usuarios.docs.map( usuarioSnapshot => usuarioSnapshot.data() ) )
    );
  }

  async login ( usuario : Usuario ) {
    const usuarioSnapshot = await this.checkIfExist(usuario);

    if ( usuarioSnapshot === undefined ) {
      this.errorInicioDeSesion.emit( "Los datos ingresados no son correctos" );
      return;
    }

    const usuarioDB = usuarioSnapshot.data() as Usuario;

    if ( usuarioDB.aprobado != undefined && !usuarioDB.aprobado ) return false;
    if ( usuarioDB.contrasenia != usuario.contrasenia ) return false;

    usuarioDB.email = usuario.email;
    this.sesionIniciada.emit(usuario);

    //Guardo en Storage para preservar la sesión.
    sessionStorage.setItem("userLogged", JSON.stringify(usuarioDB));

    this.userLogged = usuarioDB;
    this.logger( usuarioDB.email, 'Inicio de Sesion' );
    return true;
  }

  async checkIfExist ( usuario : Usuario ) {
    const usuarioSnapshot = await firstValueFrom(this.db.collection(this.collectionUsr).doc<Usuario>( usuario.email ).get());

    if ( !usuarioSnapshot?.exists ) {
      return undefined;
    }
    
    return usuarioSnapshot;
  }

  async register ( usuario : Usuario ) {
    const usuarioLogeado = ( await this.checkIfExist(usuario) );

    if ( usuarioLogeado != undefined ) {
      this.usuarioYaRegistrado.emit("El email ya se encuentra en uso");
      return
    }
    
    try {
      await this.db.collection(this.collectionUsr).doc( usuario.email ).set( {...usuario} );
      this.logger( usuario.email, 'Registro' );
      this.registro.emit(usuario);
      this.userLogged = usuario;
    } catch ( error ) {
      this.errorRegistro.emit("Error al registrarse, intentá nuevamente");
      throw error;
    }
  }

  logout() {
    this.userLogged = undefined;
    this.sesionTerminada.emit(true);
  }

  logger( email? : string, logEvent? : string ) {

    const hora = new Date();
    const log = {
      logEvent,
      hora,
      email
    };
    
    this.db.collection('logs').add( {...log} );
  }

  getLogs() {
    return this.db.collection('logs')
            .get()
            .toPromise()
            .then( (snapshots) => snapshots?.docs ).then( (docs) => docs?.map( (doc) => doc.data() ) );
  }

  async getAdmins() {
    return await this.getUsuariosPorRazon("0");
  }

  async getEspecialistas() {
    return await this.getUsuariosPorRazon("1");
  }

  async getPacientes() {
    return await this.getUsuariosPorRazon("2");
  }

  getEspecialistasPorEspecialidad( especialidad : string ) {
    return this.db.collection( this.collectionUsr ).ref.where( "especialidad", "==", especialidad )
              .get()
              .then( snapshots => snapshots.docs.map( snapshot => snapshot.data() ) );
  }

  getUsuario ( email : string ) {
    return this.db.collection( this.collectionUsr ).doc( email )
              .get()
              .toPromise()
              .then( snapshot => snapshot?.data() );
  }  

  async getUsuariosAtendidosPorEspecialista ( especialistaEmail : string ) {
    const collectionTurnos = "turnos";
    const pacientesMails = await this.db.collection( collectionTurnos ).ref
                                .where( "especialista", "==", especialistaEmail )
                                .get()
                                .then( snapshots => snapshots.docs.map( snapshot => snapshot.data() ) )
                                .then( (allData) => allData.map( (data : any) => data.paciente ) )
                                .then( (pacientes) => pacientes.filter( (value, index, array) => array.indexOf(value) === index ) );
    
    const pacientes = [];

    for ( let pacienteMail of pacientesMails )
      pacientes.push( await this.getUsuario( pacienteMail ) );
  
    return pacientes;
  }

  getEspecialistasQueAtendieronAUsuario ( usuarioEmail : string ) {
    const collectionTurnos = "turnos";
    return this.db.collection( collectionTurnos ).ref
                        .where( 'paciente', "==", usuarioEmail )
                        .get()
                        .then( snapshots => snapshots.docs.map( snapshot => snapshot.data() ) )
                        .then( (datas: any) => datas.map( (data : any) => data.especialista ) );
  }

  private getUsuariosPorRazon( razon : string ) {
    return this.db.collection( this.collectionUsr ).ref.where( 'razon', '==', razon )
              .get()
              .then( snapshots => snapshots.docs.map( snapshot => snapshot.data() ) );
  }
}
