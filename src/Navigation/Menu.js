import React, { Component } from 'react'
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, Row, Image} from 'react-bootstrap'
import Link from 'react-router/lib/Link'
import firebase from './../Functions/conexion'
import logo from './../Images/Logo.png'
import { LinkContainer } from 'react-router-bootstrap'

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
                        <LinkContainer to={`/contacto`}>
                        <MenuItem eventKey={1.1} href={'#'}>Contacto</MenuItem></LinkContainer>
                        {this.state.userSavedData.nivel >= 2?
                            <LinkContainer to={`/mensajes`}>
                            <MenuItem eventKey={1.2} href={`#`}>Mensajes</MenuItem></LinkContainer>:
                            null
                        }
                    </NavDropdown>
                    {this.state.userSavedData.nivel >= 1?
                        <NavDropdown eventKey={2} title="Usuario" id="basic-nav-dropdown">
                            <LinkContainer to={`/usuario/${this.state.userSavedData.uid}/departamentos`}>
                            <MenuItem eventKey={2.1} href={`#`}>Registros de pagos Realizados</MenuItem>
                            </LinkContainer>
                            {this.state.userSavedData.nivel >= 2?
                                <LinkContainer to={`/usuario/${this.state.userSavedData.uid}/consulta-pagos`}>
                                    <MenuItem eventKey={2.2} href={`#`}>Registros cobro de sueldos</MenuItem>
                                </LinkContainer>:
                                null
                            }
                            <MenuItem divider />
                            <LinkContainer to={`/usuario/${this.state.userSavedData.uid}/editar-usuario`}>
                            <MenuItem eventKey={2.3} href={`#`}>Editar usuario</MenuItem>
                            </LinkContainer>
                            {/*<MenuItem eventKey={2.3} href={`/usuario/${this.state.userSavedData.uid}/foros`}>Foros</MenuItem>*/}
                        </NavDropdown>: 
                        null
                    }
                    {this.state.userSavedData.nivel >= 3?
                        <NavDropdown eventKey={3} title="Administrador" id="basic-nav-dropdown">
                            <LinkContainer to={`/administrador/registros-edificio`}>
                            <MenuItem eventKey={3.1} href='#'>Registro de expensas</MenuItem>
                            </LinkContainer>
                            <LinkContainer to={`/administrador/registros-cobros-expensas`}>
                            <MenuItem eventKey={3.2} href='#'>Registro de cobros</MenuItem>
                            </LinkContainer>
                            <LinkContainer to={`/administrador/registros-departamentos`}>
                            <MenuItem eventKey={3.3} href='#'>Registro de departamentos</MenuItem>
                            </LinkContainer>
                            <LinkContainer to={`/administrador/admin-solicitudes`}>
                            <MenuItem eventKey={3.4} href='#'>Solicitudes</MenuItem>
                            </LinkContainer>
                            <MenuItem divider />
                            <LinkContainer to={`/administrador/admin-usuarios`}>
                            <MenuItem eventKey={3.5} href='#'>Control de usuarios</MenuItem>
                            </LinkContainer>
                            <LinkContainer to={`/administrador/registros-proveedores`}>
                            <MenuItem eventKey={3.6} href='#'>Registro de proveedores</MenuItem>
                            </LinkContainer>
                            <LinkContainer to={`/administrador/registros-gastos`}>
                            <MenuItem eventKey={3.7} href='#'>Registro de gastos</MenuItem>
                            </LinkContainer>
                            <LinkContainer to={`/administrador/pagos-empleados`}>
                            <MenuItem eventKey={3.8} href='#'>Pagos a empleados</MenuItem>
                            </LinkContainer>
                        </NavDropdown>: 
                        null
                    }
                    {this.state.userSavedData.nivel >= 1?
                        <NavDropdown eventKey={4} title="Foros" id="basic-nav-dropdown">
                            <LinkContainer to={`/foros/discusiones`}>
                                <MenuItem eventKey={4.1} href={`#`}>Lista discusiones</MenuItem>
                            </LinkContainer>
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
