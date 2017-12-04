import React, { Component } from 'react';
import _ from 'underscore'
import { Navbar, NavDropdown, NavItem, Grid, Table, Glyphicon, Modal} from 'react-bootstrap';
import { Button, ButtonGroup, DropdownButton, MenuItem, Nav, Row, Col, Image } from 'react-bootstrap';
import firebase from './../Functions/conexion'
import Link from 'react-router/lib/Link'

var db = firebase.database()

export default class ControlaRecibos extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			recibosDep: '', user: '',
			idVecino:'', userSavedData: '', departamento: ''
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
		var idVecino = that.props.params.userId || '' 
		var idDep = that.props.params.idDep || ''
		this.setState({
			idVecino: idVecino,
		})
		var recibosDep = db.ref('recibos').orderByChild('idDep').equalTo(idDep)
		recibosDep.on('value',(snapshot)=>{
			this.setState({
				recibosDep: snapshot.val()
			})
		})
		firebase.database().ref('departamentos').child(idDep).on('value',(snapshot)=>{
			that.setState({
				departamento: snapshot.val() || '',
				departamentoId: snapshot.key ||  '',
			})
		})
		firebase.database().ref('usuarios').child(this.props.params.userId).on('value',(snapshot)=>{
			that.setState({
				user: snapshot.val() || '',
			})
		})
	}
	render(){
		return(
			<div className='ControlarRecibos'>
				<h3>Lista de recibos pagados: {this.state.user.displayName || 'NoNAME'}</h3>
				<h4>Departamento N°: <b>{this.state.departamento.numero}</b> | Piso: <b>{this.state.departamento.piso}</b> | Edificio: <b>{this.state.departamento.nombreEdificio}</b></h4>
				<h3>Seleccione el recibo correspondiente para mas detalle</h3>
				{this.state.recibosDep === ''?
					<h4>El cliente no tiene cuentas pagadas</h4>:
					<Table responsive style={{'textAlign':'left'}}>
						<thead>
							<tr>
								<th>ID Recibo</th>
								<th>Fecha recibo</th>
								<th>Total</th>
								<th>Funcion</th>
							</tr>
						</thead>
						<tbody>
							{_.map(this.state.recibosDep, (value, key)=>
								<Recibo recibo={value} reciboId={key} userId={this.props.params.userId} idDep={this.props.params.idDep}/>
							)}
						</tbody>
					</Table>
				}
			</div>
		)
	}
}

class Recibo extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			recibo: '',
			reciboId: '', showModalDelete:false,
		}
	}
	componentWillMount(){
		this.setState({
			recibo: this.props.recibo || '',
			reciboId: this.props.reciboId || '',
		})
	}
	componentWillReceiveProps(nextProps){
		if(this.props !=nextProps){
			this.setState({
				recibo: nextProps.recibo || '',
				reciboId: nextProps.reciboId || '',
			})
		}
	}
	delete=()=>{
		firebase.database().ref('pagos').orderByChild('idRecibo').equalTo(this.state.reciboId).on('value',(snapshot) => {
			_.map(snapshot.val(),(comment,commentKey)=>{
				firebase.database().ref('pagos').child(commentKey).on('value',(childSnapshot)=>{
					childSnapshot.ref.remove();
				});
			})
		});
		firebase.database().ref('recibos').child(this.props.reciboId).on('value',(snapshot)=>{
			snapshot.ref.remove()
		})
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
	render(){
		return(
			<tr>
				<td>{this.state.reciboId}</td>
				<td>{this.state.recibo.fechaRecibo}</td>
				<td>{this.state.recibo.totalRecibo}</td>
				<td>
					<Link to={`/administrador/admin-usuarios/${this.props.userId}/departamentos/${this.props.idDep}/recibos/${this.state.reciboId}/pagos`}>
						<Button bsStyle='info'>Ir a detalle   <Glyphicon glyph='th-list'/></Button>
					</Link>
					<Button bsStyle='danger' onClick={this.openModalDelete}>Eliminar   <Glyphicon glyph='trash'/></Button>
				</td>
				<Modal show={this.state.showModalDelete} onHide={this.closeModalDelete}>
					<Modal.Header closeButton>
						<Modal.Title>Advertencia</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						¿Esta seguro que desea borrar el recibo?
					</Modal.Body>
					<Modal.Footer>
						<ButtonGroup>
							<Button bsStyle='danger' onClick={this.delete}>Borrar</Button>
							<Button bsStyle='info' onClick={this.closeModalDelete}>Cancelar</Button>
						</ButtonGroup>
					</Modal.Footer>
				</Modal>
			</tr>
		)
	}
}

