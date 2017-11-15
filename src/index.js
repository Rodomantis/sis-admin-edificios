import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import Menu from './Navigation/Menu'
import App from './Navigation/App'
import NoMatch from './Navigation/NoMatch'
import Info from './Components/Info'
import Home from './Components/Home'
import ConsultaCliente from './Components/ConsultaCliente'
import RegistroDep from './Components/RegistroDep'
import ClienteDep from './Components/ClienteDep'
import AdminUsuarios from './Components/AdminUsuarios'
import UserAdmin from './Components/UserAdmin'
import PagoDetalle from './Components/PagoDetalle'
import DetalleServicio from './Components/DetalleServicio'
import UserHome from './Navigation/UserHome'
import Solicitations from './Components/Solicitations'
import SolicitationAdmin from './Components/SolicitationAdmin'
import SisLogin from './Components/SisLogin'
import AdminHome from './Navigation/AdminHome'
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
                <Route path="registros-edificio" components={RegistrosEdificio} />
                <Route path="registros-cobros-expensas" components={RegistrosCobros} />
                <Route path="registros-cobros-expensas/:userId/generar-recibo" components={GenerarRecibo} />
                <Route path="admin-usuarios" components={AdminUsuarios} />
                <Route path="admin-usuarios/:userId/usuario" components={UserAdmin} />
                <Route path="admin-solicitudes" components={SolicitationAdmin}/>
            </Route>
            <Route path="/usuario/:userId" component={UserHome}>
                <Route path="consulta-pagos" components={ConsultaCliente} />
                <Route path="consulta-pagos/:idRecibo/pago-detalle" components={PagoDetalle}/>
                <Route path="detalle-servicio/:idServicio" components={DetalleServicio} />
                <Route path="departamentos" components={ClienteDep} />
            </Route>
            <Route path="/login" component={SisLogin}/>
            <Route path="/solicitudes" component={Solicitations}/>
            <Route path="/contacto" component={Info}/>
            <Route path="*" component={NoMatch}/>
        </Route>
    </Router>,
document.getElementById('root'));
registerServiceWorker();
