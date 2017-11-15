import React, { Component } from 'react'
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, Row, Image} from 'react-bootstrap'
import Link from 'react-router/lib/Link'
import firebase from './../Functions/conexion'

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
                    <a href="/">Sistema de administracion de edificios</a>
                </Navbar.Brand>
                <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                <Nav>
                    <NavItem eventKey={1}><Link to={'/contacto'} style={{'color':'grey'}}>Contacto</Link></NavItem>
                    {this.state.userSavedData.nivel >= 1?
                        <NavDropdown eventKey={2} title="Usuario" id="basic-nav-dropdown">
                            <MenuItem eventKey={2.1} href={`/usuario/${this.state.userSavedData.uid}/consulta-pagos`}>Registros de pagos</MenuItem>
                            <MenuItem eventKey={2.2} href={`/usuario/${this.state.userSavedData.uid}/departamentos`}>Registros Departamentos</MenuItem>
                            <MenuItem divider />
                            <MenuItem eventKey={2.3}>Separated link</MenuItem>
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
							<Image src={this.state.userSavedData.photoURL} circle style={{'width':'30px','height':'30px'}}/>
						</Row>
                    }
                    </MenuItem>
                </Nav>
                </Navbar.Collapse>
            </Navbar>
        )
    }
}
