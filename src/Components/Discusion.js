import React, { Component } from 'react';
import SisLogin from './../Components/SisLogin'
import firebase from './../Functions/conexion' 
import {Link} from 'react-router'
import { Navbar, NavDropdown, NavItem, Grid, Table, Panel, FormControl, ListGroup, ListGroupItem} from 'react-bootstrap';
import ReactMarkdown from 'react-markdown'
import _ from 'underscore'
import { Modal, Glyphicon, Jumbotron, Button, ButtonGroup, DropdownButton, MenuItem, Nav, Row, Col, Image } from 'react-bootstrap';

export default class Discusion extends React.Component{
    constructor(props){
        super(props)
        this.state={
            discusion: '',
            discusionId: '',
            comentarios: '', crearComentario: false, userSavedData: ''
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
        var discusion = firebase.database().ref('discusiones').child(that.props.params.discusionId)
        discusion.on('value',(snapshot)=>{
            that.setState({
                discusion: snapshot.val() || ''
            })
        })
        that.setState({
            discusionId: that.props.params.discusionId || ''
        })
        var comentarios = firebase.database().ref('comentarios').orderByChild('discusionId').equalTo(that.props.params.discusionId)
        comentarios.on('value',(snapshot)=>{
            that.setState({
                comentarios: snapshot.val() || ''
            })
        })
    }
    crearComentario=()=>{this.setState({crearComentario: !this.state.crearComentario})}
    cerrarComentario=()=>{this.setState({crearComentario: false})}
    render(){
        return(
            <div className='Discusion' style={{'paddingLeft':'5px', 'paddingRight': '5px', 'textAlign': 'justify'}}>
                <Button bsStyle='info' onClick={this.crearComentario}>
                    Crear comentario   <Glyphicon glyph={this.state.crearComentario == true? 'minus':'plus'}/></Button>
                <Panel collapsible expanded={this.state.crearComentario}>
                    <ComentarioForm discusionId={this.props.params.discusionId} cerrarComentario={this.cerrarComentario} />
                </Panel>
                <h4>Discusion del tema: {this.state.discusion.titulo}</h4>
                <div className='panel panel-info'>
                    <div className='panel-heading'>
                        <div className="pull-right">
                            {this.state.discusion.creatorName+" comentó:"}
                        </div>
                        <div className="pull-left">
                        {this.state.discusion.creationDate}
                        </div>
                        <div className="clearfix"/>
                    </div>
                    <div className='panel-body'>
                        <ReactMarkdown source={this.state.discusion.contenidoPost}/>
                    </div>
                </div>
                {_.map(this.state.comentarios,(value,key)=>
                    <Comentario comentario={value} idComentario={key} uid={this.state.userSavedData.uid}/>
                )}
            </div>
        )
    }
}

class ComentarioForm extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            discusionId: '', contenidoPost: '', userSavedData: '', discusion: ''
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
        that.setState({
            discusionId: that.props.discusionId
        })
    }
    handlePost=(e)=>{this.setState({contenidoPost: e.target.value})}
    guardarDiscusion=()=>{
        if(this.state.contenidoPost != ''){
            var fecha = new Date().toJSON().slice(0,10).replace(/-/g,'/')
            var that = this
            var nuevoComentario = firebase.database().ref('comentarios').push()
            var data = {
                discusionId: that.state.discusionId,
                creationDate: fecha,
                creatorName: this.state.userSavedData.displayName || '',
                creatorId: this.state.userSavedData.uid || '',
                contenidoPost: this.state.contenidoPost || '',
            }
            nuevoComentario.set(data)
            this.props.cerrarComentario()
        }else{
            alert('No deje espacios en blanco')
        }
    }
    render(){
        return(
            <div className='ForosForm'>
                <h4>Ingresar mensaje a la discusion</h4>
                <p>- Para aumentar el tamaño de la fuente usar el simbolo numeral antes de un # Titulo</p>
                <p>- Para hacer un salto de parrafo usar 2 veces la tecla enter</p>
                <p>- Para listas usar el simbolo asterisco * y usar dos veces la tecla enter para el salto de parrafo</p>
                <p>- Para Links usar el formato [Link a google](https://www.google.com)</p>
                <p>- Para Imagenes usar el formato ![Titulo de la imagen](http://mimadretierra.bo/wp-content/uploads/2016/11/ucatec.png)</p>
                <Button bsStyle='warning' onClick={this.guardarDiscusion}>Guardar comentario <Glyphicon glyph='hdd'/></Button>
                <Row style={{'paddingTop': '5px'}}>
                    <Col xs={12} sm={12} md={6} lg={6}>
                        <FormControl
                            type="text"
                            value={this.state.contenidoPost}
                            placeholder="Ingresar comentario"
                            componentClass="textarea"
                            onChange={this.handlePost}/>
                    </Col>
                    <Col xs={12} sm={12} md={6} lg={6}>
                        <div style={{'height': '300px', 'overflowY': 'scroll', 'borderRadius': '5px', 'borderColor': 'grey'}}>
                            <ReactMarkdown source={this.state.contenidoPost}/>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}

class Comentario extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			comentario: '', userSavedData: '', uid: '',
			idComentario: '', showModalDelete:false,
		}
	}
	componentWillMount(){
		var that = this 
		that.setState({
			comentario: this.props.comentario || '',
			idComentario: this.props.idComentario || '',
			uid: this.props.uid || '',
		})
	}
	componentWillReceiveProps(nextProps){
		if(this.props != nextProps){
			var that = this 
			that.setState({
				comentario: nextProps.comentario || '',
                idComentario: nextProps.idComentario || '',
                uid: nextProps.uid,
			})
		}
	}
	deleteComment=()=>{
		firebase.database().ref('comentarios').child(this.state.idComentario).on('value',(snapshot)=>{
			snapshot.ref.remove()
		});
		this.closeModalDelete()
	}
	openModalDelete=()=>{
		this.setState({
			showModalDelete: true,
		})
	}
	closeModalDelete=()=>{
		this.setState({
			showModalDelete: false,
		})
	}
	deleteComment
	render(){
		return(
			<div className='panel panel-info'>
				<div className='panel-heading'>
                    <div className="pull-right">
                        {this.state.comentario.creatorName+" comentó:"}
                        {this.props.comentario.creatorId === this.props.uid?
                            <Glyphicon bsStyle="danger" onClick={this.openModalDelete} 
                            glyph="remove-sign"/>:
                            null
					    }
                    </div>
                    <div className="pull-left">
                    {this.state.comentario.creationDate}
                    </div>
                    <div className="clearfix"/>
                </div>
                <div className='panel-body'>
                    <ReactMarkdown source={this.state.comentario.contenidoPost}/>
                </div>
				<Modal show={this.state.showModalDelete} onHide={this.closeModalDelete}>
					<Modal.Header closeButton>
						<Modal.Title>Advertencia</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						{this.state.comentario.creatorName}
						¿Esta seguro que desea borrar el comentario?
					</Modal.Body>
					<Modal.Footer>
						<ButtonGroup>
							<Button bsStyle='danger' onClick={this.deleteComment}>Borrar</Button>
							<Button bsStyle='info' onClick={this.closeModalDelete}>Cancelar</Button>
						</ButtonGroup>
					</Modal.Footer>
				</Modal>
			</div>
		)
	}
}