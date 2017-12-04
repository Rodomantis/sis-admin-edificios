import React, { Component } from 'react';
import SisLogin from './../Components/SisLogin'
import firebase from './../Functions/conexion' 
import {Link} from 'react-router'
import { Navbar, NavDropdown, NavItem, Grid, Table, Panel, FormControl, ListGroup, ListGroupItem} from 'react-bootstrap';
import ReactMarkdown from 'react-markdown'
import _ from 'underscore'
import { Modal, Glyphicon, Jumbotron, Button, ButtonGroup, DropdownButton, MenuItem, Nav, Row, Col, Image } from 'react-bootstrap';

export default class Foros extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            discusiones: '',
            crearDiscusion: false, userSavedData: '',
        }
    }
    componentWillMount(){
        var that = this
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
        var discusiones = firebase.database().ref('discusiones')
        discusiones.on('value', (snapshot)=>{
            that.setState({
                discusiones: snapshot.val() || ''
            })
        },this)
    }
    crearDiscusion=()=>{this.setState({crearDiscusion: !this.state.crearDiscusion})}
    cerrarDiscusion=()=>{this.setState({crearDiscusion: false})}
    render(){
        return(
            <div className = 'Foros'>
                <Button bsStyle='info' onClick={this.crearDiscusion}>Crear tema <Glyphicon glyph='plus'/></Button>
                <Panel collapsible expanded={this.state.crearDiscusion}>
                    <ForosForm cerrarDiscusion={this.cerrarDiscusion} />
                </Panel>
                <h3>LISTA DE DISCUSIONES</h3>
                <h4>Puede crear temas para discuciones del edificio</h4>
                <Table responsive style={{'textAlign':'left'}}>
                    <thead>
                        <tr>
                            <th>Titulo</th>
                            <th>Fecha</th>
                            <th>Creado por</th>
                            <th>Opciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {_.map(this.state.discusiones,(value,key)=>
                            <EditarDiscusion discusion={value} discusionId={key} nivel={this.state.userSavedData.nivel} uid={this.state.userSavedData.uid}/>
                        )}
                    </tbody>
                </Table>
            </div>
        )
    }
}

class EditarDiscusion extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            discusion: '', nivel:'',
            discusionId: '', delModal: false, 
        }
    }
    componentWillMount(){
        var that = this
        that.setState({
            discusion: that.props.discusion ||'',
            discusionId: that.props.discusionId ||'',
        })
    }
    componentWillReceiveProps(nextProps){
        if(this.props != nextProps){
            var that = this
            that.setState({
                discusion: nextProps.discusion ||'',
                discusionId: nextProps.discusionId ||'',
            })
        }
    }
    deleteDisc=()=>{
		var that = this
		firebase.database().ref('comentarios').orderByChild('discusionId').equalTo(that.state.discusionId).on('value',(snapshot) => {
			_.map(snapshot.val(),(comment,commentKey)=>{
				firebase.database().ref('comentarios').child(commentKey).on('value',(childSnapshot)=>{
					childSnapshot.ref.remove();
				});
			})
		});
		firebase.database().ref('discusiones').child(that.state.discusionId).on('value',(snapshot)=>{
			snapshot.ref.remove();
		})
	}
	openDelModal=()=>{this.setState({delModal: true})}
    closeDelModal=()=>{this.setState({delModal: false})}
    render(){
        return(
            <tr>
                <td><Link to={`/foros/discusiones/${this.state.discusionId}`} style={{'color':'black'}}>
                    <b>{this.state.discusion.titulo}</b>
                </Link></td>
                <td>{this.state.discusion.creationDate}</td>
                <td>{this.state.discusion.creatorName}</td>
                <td>
                    <Link to={`/foros/discusiones/${this.state.discusionId}`}>
                        <Button bsStyle='info'>Acceder  <Glyphicon glyph='list'/></Button>
                    </Link>
                    {this.props.nivel >= 3 || this.props.uid == this.state.discusion.creatorId?
                        <Button bsStyle='danger' onClick={this.openDelModal}>Borrar  <Glyphicon glyph='remove-sign'/></Button>:
                        null
                    }
                </td>
                <Modal show={this.state.delModal} onHide={this.closeDelModal}>
					<Modal.Header closeButton>
						<Modal.Title>Eliminar Discusion</Modal.Title>
					</Modal.Header>
					<Modal.Body>
					</Modal.Body>
						¿Esta seguro que desea eliminar la Discusion?
					<Modal.Footer>
						<ButtonGroup>
							<Button bsStyle='danger' onClick={this.deleteDisc}>Borrar</Button>
                            <Button bsStyle='warning' onClick={this.closeDelModal}>Cancelar</Button>:
						</ButtonGroup>
					</Modal.Footer>
                </Modal>
            </tr>
        )
    }
}

class ForosForm extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            discusionCont: '',
            discusionTitulo: '',
            userSavedData: '',
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
    }
    handlePrimerPost=(e)=>{this.setState({discusionCont: e.target.value})}
    handleTitulo=(e)=>{this.setState({discusionTitulo: e.target.value})}
    guardarDiscusion=()=>{
        if(this.state.discusionCont != '' || this.state.discusionTitulo != ''){
            var fecha = new Date().toJSON().slice(0,10).replace(/-/g,'/')
            var that = this
            var nuevaDiscusion = firebase.database().ref('discusiones').push()
            var data = {
                titulo: this.state.discusionTitulo,
                creationDate: fecha,
                creatorName: this.state.userSavedData.displayName || '',
                creatorId: this.state.userSavedData.uid || '',
                contenidoPost: this.state.discusionCont || '',
            }
            nuevaDiscusion.set(data)
            this.props.cerrarDiscusion()
        }else{
            alert('No deje espacios en blanco')
        }
    }
    render(){
        return(
            <div className='ForosForm'>
                <h4>Ingresar el titulo de la discusion</h4>
                <FormControl type='text' onChange={this.handleTitulo} value={this.state.discusionTitulo}/>
                <h4>Ingresar el primer mensaje de la discusion</h4>
                <p>- Para aumentar el tamaño de la fuente usar el simbolo numeral antes de un # Titulo</p>
                <p>- Para hacer un salto de parrafo usar 2 veces la tecla enter</p>
                <p>- Para listas usar el simbolo asterisco * y usar dos veces la tecla enter para el salto de parrafo</p>
                <p>- Para Links usar el formato [Link a google](https://www.google.com)</p>
                <p>- Para Imagenes usar el formato ![Titulo de la imagen](http://mimadretierra.bo/wp-content/uploads/2016/11/ucatec.png)</p>
                <Button bsStyle='warning' onClick={this.guardarDiscusion}>Crear tema <Glyphicon glyph='hdd'/></Button>
                <Row style={{'paddingTop': '5px'}}>
                    <Col xs={12} sm={12} md={6} lg={6}>
                        <FormControl
                            type="text"
                            value={this.state.discusionCont}
                            placeholder="Ingresar el primer mensaje del foro"
                            componentClass="textarea"
                            onChange={this.handlePrimerPost}/>
                    </Col>
                    <Col xs={12} sm={12} md={6} lg={6}>
                        <div style={{'height': '300px', 'overflowY': 'scroll', 'borderRadius': '5px', 'borderColor': 'grey'}}>
                            <ReactMarkdown source={this.state.discusionCont}/>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}