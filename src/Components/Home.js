import React, { Component } from 'react';
import SisLogin from './../Components/SisLogin'
import firebase from './../Functions/conexion' 
import {Link} from 'react-router'
import { Navbar, NavDropdown, NavItem, Grid, Panel, FormControl, ListGroup, ListGroupItem} from 'react-bootstrap';
import ReactMarkdown from 'react-markdown'
import { Jumbotron, Button, ButtonGroup, DropdownButton, MenuItem, Nav, Row, Col, Image } from 'react-bootstrap';

var db = firebase.database()

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userSavedData: '',
            userId: '',
        }
    }
    componentWillMount(){
        var that = this;
		var user = firebase.auth().onAuthStateChanged(function(user) {
			if (user) {
			  	console.log(user.displayName)
			  	that.setState({
				  	userId: user.uid || ''
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
        firebase.database().ref("infoAdmin").on("value",(snapshot)=>{
			this.setState({
				msgAdminData: snapshot.val().msgBienvenida || "",
				mensajeBienvenida: snapshot.val().msgBienvenida || "",
			})
		})
	}
	handleMensajeBnvda =(e)=> {
		this.setState({
			mensajeBienvenida: e.target.value
		})
	}
	guardarBienvenida =()=>{
		var fecha = new Date().toJSON().slice(0,10).replace(/-/g,'/');
		var queryB = db.ref("infoAdmin")
		var datosMensaje = {
			msgBienvenida: this.state.mensajeBienvenida,
			fechaAct: fecha
		}
		queryB.update(datosMensaje)
		
	}
    render() {
        return (
            <div>
                <Col xs={12} sm={12} md={12} lg={12}>
                    <div style={{"margin":"10px", "opacity":"0.9", "height":"500px", "backgroundColor":"white","borderRadius": "10px", "overflowY": "scroll"}}>
                        <ListGroup>
                            <ListGroupItem>  
                                <h2>Bienvenido usuario: </h2>
                                <h2>{this.state.userSavedData.displayName || 'Invitado'}</h2>
                                <h4>Acceda a la función que desee utilizar</h4>
                            </ListGroupItem>
                                {this.state.userSavedData !== ""?
                                <ListGroupItem>
                                    <Button bsStyle="warning" 
                                    onClick={()=>{this.setState({editarBienvenida: !this.state.editarBienvenida})}}
                                    >
                                    Editar Bienvenida
                                    </Button>
                                    <Panel collapsible expanded={this.state.editarBienvenida}>
                                        <Row>
                                            <Col xs={12} sm={12} md={6} lg={6}>
                                                <FormControl
                                                type="text"
                                                value={this.state.mensajeBienvenida}
                                                placeholder="Ingresar la el mensaje de bienvenida"
                                                ref ="msgWelcome"
                                                componentClass="textarea"
                                                onChange={this.handleMensajeBnvda}/>
                                            </Col>
                                            <Col xs={12} sm={12} md={6} lg={6}>
                                                <ReactMarkdown source={this.state.mensajeBienvenida}/>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Button bsStyle="warning" onClick={this.guardarBienvenida}>Guardar</Button>
                                        </Row>
                                    </Panel>
                                </ListGroupItem>:
                                null
                                }
                                {this.state.userSavedData ==''?
                                    <ListGroupItem>
                                        <h3>Por favor confirmar usuario para acceder a la pagina</h3>
                                        <Link to='/login'>
                                            <Button bsStyle='info'>Ingresar</Button>
                                        </Link>
                                    </ListGroupItem>:
                                    null
                                }
                            <ListGroupItem>
                                <h2>Mensaje del administrador</h2>
                                <Row>
                                    <Col xs={0} sm={0} md={3} lg={3}/>
                                    <Col xs={12} sm={12} md={6} lg={6}>
                                        <ReactMarkdown source={this.state.msgAdminData}/>
                                    </Col>
                                    <Col xs={0} sm={0} md={3} lg={3}/>
                                </Row>
                            </ListGroupItem>
                        </ListGroup>
                    </div>
                </Col>
            </div>
        )
    }
}