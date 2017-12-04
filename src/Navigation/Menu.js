import React, { Component } from 'react'
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, Row, Image} from 'react-bootstrap'
import Link from 'react-router/lib/Link'
import firebase from './../Functions/conexion'
import logo from './../Images/Logo.png'

export default class Menu extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            userSavedData: '', userData: '',
        }
    }
    componentWillMount(){
        var that = this;
		var user = firebase.auth().onAuthStateChanged(function(user) {
			if (user) {
			  	console.log(user.displayName)
			  	that.setState({
                    userId: user.uid || '',
                    userData: user
			  	})
			  	var userSavedData = firebase.database().ref('usuarios/'+user.uid)
			  	userSavedData.on('value', function(value){
				  	console.log('--->', value.val())
				  	that.setState({
					    userSavedData: value.val() || '',
				  	})
			  	})
			} else {
                that.setState({
                    userSavedData: '',
                })
			}
        });
    }
    logout = () => {
		firebase.auth().signOut().then(() => {
        //Salida correcta
			this.setState({
				userSavedData:''
			}),this
		}, (error) => {
			//error
		});
    }
    render(){
        return(
            <Navbar inverse collapseOnSelect>
                <Navbar.Header>
                <Navbar.Brand>
                    <Link to='/'>
                        <Image src={logo}  style={{'height':'30px'}}/>
                    </Link>
                    {/*<a href="/">Sistema de administracion de edificios</a>*/}
                </Navbar.Brand>
                <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                <Nav>
                    <NavDropdown eventKey={1} title="Info" id="basic-nav-dropdown">
                        <MenuItem eventKey={1.1} href={`/contacto`}>Contacto</MenuItem>
                    </NavDropdown>
                    {this.state.userSavedData.nivel >= 1?
                        <NavDropdown eventKey={2} title="Usuario" id="basic-nav-dropdown">
                            <MenuItem eventKey={2.1} href={`/usuario/${this.state.userSavedData.uid}/departamentos`}>Registros de pagos Realizados</MenuItem>
                            {this.state.userSavedData.nivel >= 2?
                                <MenuItem eventKey={2.2} href={`/usuario/${this.state.userSavedData.uid}/consulta-pagos`}>Registros cobro de sueldos</MenuItem>:
                                null
                            }
                            <MenuItem divider />
                            <MenuItem eventKey={2.3} href={`/usuario/${this.state.userSavedData.uid}/editar-usuario`}>Editar usuario</MenuItem>
                            {/*<MenuItem eventKey={2.3} href={`/usuario/${this.state.userSavedData.uid}/foros`}>Foros</MenuItem>*/}
                        </NavDropdown>: 
                        null
                    }
                    {this.state.userSavedData.nivel >= 3?
                        <NavDropdown eventKey={3} title="Administrador" id="basic-nav-dropdown">
                            <MenuItem eventKey={3.1} href='/administrador/registros-edificio'>Registro de expensas</MenuItem>
                            <MenuItem eventKey={3.2} href='/administrador/registros-cobros-expensas'>Registro de cobros</MenuItem>
                            <MenuItem eventKey={3.3} href='/administrador/registros-departamentos'>Registro de departamentos</MenuItem>
                            <MenuItem eventKey={3.4} href='/administrador/admin-solicitudes'>Solicitudes</MenuItem>
                            <MenuItem divider />
                            <MenuItem eventKey={3.5} href='/administrador/admin-usuarios'>Control de usuarios</MenuItem>
                            <MenuItem eventKey={3.6} href='/administrador/registros-proveedores'>Registro de proveedores</MenuItem>
                            <MenuItem eventKey={3.7} href='/administrador/registros-gastos'>Registro de gastos</MenuItem>
                            <MenuItem eventKey={3.8} href='/administrador/pagos-empleados'>Pagos a empleados</MenuItem>
                        </NavDropdown>: 
                        null
                    }
                    {this.state.userSavedData.nivel >= 1?
                        <NavDropdown eventKey={4} title="Foros" id="basic-nav-dropdown">
                            <MenuItem eventKey={4.1} href={`/foros/discusiones`}>Lista discusiones</MenuItem>
                        </NavDropdown>:
                        null
                    }
                </Nav>
                <Nav pullRight>
                    <MenuItem eventKey={4}>
                    {this.state.userSavedData == ''?
						<Link style={{'color':'white'}} to="/Login">Iniciar Sesion </Link>:
						<Row>
							<a onClick={this.logout} style={{'color':'white'}}>Cerrar Sesion </a>
							<Image src={this.state.userSavedData.photoURL || "https://myspace.com/common/images/user.png"} circle style={{'width':'30px','height':'30px'}}/>
						</Row>
                    }
                    </MenuItem>
                </Nav>
                </Navbar.Collapse>
            </Navbar>
        )
    }
}
