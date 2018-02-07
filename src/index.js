import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import Menu from './Navigation/Menu'
import App from './Navigation/App'
import NoMatch from './Navigation/NoMatch'
import Info from './Components/Info'
import Home from './Components/Home'
import Mensajes from './Components/Mensajes' 
import PagoMultas from './Components/PagoMultas'
import ConsultaCliente from './Components/ConsultaCliente'
import RegistroDep from './Components/RegistroDep'
import RegistroGastos from './Components/RegistroGastos'
import EditarUsuario from './Components/EditarUsuario'
import RegistroProveedor from './Components/RegistroProveedor'
import SelDepartamento from './Components/SelDepartamento'
import ConsultaPagos from './Components/ConsultaPagos'
import ConsultaDescuentos from './Components/ConsultaDescuentos'
import ConsultaDep from './Components/ConsultaDep'
import ControlarRecibos from './Components/ControlarRecibos'
import ControlarPagos from './Components/ControlarPagos'
import ClienteDep from './Components/ClienteDep'
import DetallePagoEmpleado from './Components/DetallePagoEmpleado'
import PagosEmpleado from './Components/PagosEmpleado'
import RegGastosEdificio from './Components/RegGastosEdificio'
import AdminUsuarios from './Components/AdminUsuarios'
import PagosPendientes from './Components/PagosPendientes'
import CrearUsuario from './Components/CrearUsuario'
import UserAdmin from './Components/UserAdmin'
import GenerarMulta from './Components/GenerarMulta'
import Deudores from './Components/Deudores'
import Discusion from './Components/Discusion'
import PagoDetalle from './Components/PagoDetalle'
import Multas from './Components/Multas'
import DetalleServicio from './Components/DetalleServicio'
import UserHome from './Navigation/UserHome'
import Solicitations from './Components/Solicitations'
import SolicitationAdmin from './Components/SolicitationAdmin'
import SisLogin from './Components/SisLogin'
import Foros from './Components/Foros'
import AdminHome from './Navigation/AdminHome'
import ForosHome from './Navigation/ForosHome'
import RegistrosEdificio from './Components/RegistrosEdificio'
import RegistrosCobros from './Components/RegistroCobros'
import GenerarRecibo from './Components/GenerarRecibo'
import registerServiceWorker from './registerServiceWorker'
import Link from 'react-router/lib/Link'
import Route from 'react-router/lib/Route'
import Router from 'react-router/lib/Router'
import browserHistory from 'react-router/lib/browserHistory'
import IndexRoute from 'react-router/lib/IndexRoute'

ReactDOM.render(
    <Router history={browserHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={Home} />
            <Route path="/administrador" component={AdminHome}>
                <Route path="registros-departamentos" components={RegistroDep} />
                <Route path="registros-proveedores" components={RegistroProveedor} />
                <Route path="registros-gastos" components={RegistroGastos} />
                <Route path="registros-gastos/:idGasto/deudores" components={Deudores} />
                <Route path="registros-gastos/registro" components={RegGastosEdificio} />
                <Route path="registros-edificio" components={RegistrosEdificio} />
                <Route path="registros-cobros-expensas" components={RegistrosCobros} />
                <Route path="registros-cobros-expensas/:userId/departamentos" components={SelDepartamento} />
                <Route path="registros-cobros-expensas/:userId/departamentos/:idDepartamento/generar-recibo" components={GenerarRecibo} />
                <Route path="registros-cobros-expensas/:userId/departamentos/:idDepartamento/pago-multas" components={PagoMultas} />
                <Route path="admin-usuarios" components={AdminUsuarios} />
                <Route path="admin-usuarios/:userId/departamentos" components={ConsultaDep} />
                <Route path="admin-usuarios/:userId/departamentos/:idDep/recibos" components={ControlarRecibos} />
                <Route path="admin-usuarios/:userId/departamentos/:idDep/recibos/:reciboId/pagos" components={ControlarPagos} />
                <Route path="admin-usuarios/:userId/usuario" components={UserAdmin} />
                <Route path="admin-solicitudes" components={SolicitationAdmin}/>
                <Route path="pagos-empleados" components={PagosEmpleado}/>
                <Route path="pagos-empleados/generar-pago/:idEmpleado" components={DetallePagoEmpleado}/>
            </Route>
            <Route path="/usuario/:userId" component={UserHome}>
                <Route path="departamentos/:idDep/consulta-pagos" components={ConsultaCliente} />
                <Route path="departamentos/:idDep/consulta-pagos/:idRecibo/pago-detalle" components={PagoDetalle}/>
                <Route path="departamentos/:idDep/detalle-servicio/:idServicio" components={DetalleServicio} />
                <Route path="departamentos/:idDep/pagos-pendientes" components={PagosPendientes} />
				<Route path="departamentos/:idDep/multas" components={Multas} />
                <Route path="departamentos/:idDep/multas/nueva" components={GenerarMulta} />
                <Route path="departamentos" components={ClienteDep} />
                <Route path="consulta-pagos" components={ConsultaPagos} />
                <Route path="consulta-pagos/:idPago/descuentos" components={ConsultaDescuentos} />
                <Route path="editar-usuario" components={EditarUsuario}/>
            </Route>
            <Route path="/foros" component={ForosHome}>
                <Route path="discusiones" components={Foros} />
                <Route path="discusiones/:discusionId" components={Discusion} />
            </Route>
            <Route path="/login" component={SisLogin}/>
            <Route path="/solicitudes" component={Solicitations}/>
            <Route path="/crear-usuario" component={CrearUsuario}/>
            <Route path="/contacto" component={Info}/>
            <Route path="/mensajes" component={Mensajes}/>
            <Route path="*" component={NoMatch}/>
        </Route>
    </Router>,
document.getElementById('root'));
registerServiceWorker();
