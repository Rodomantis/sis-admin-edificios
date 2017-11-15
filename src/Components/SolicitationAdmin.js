import React, { Component } from 'react';
import { Navbar, NavDropdown, NavItem, Grid, Table} from 'react-bootstrap';
import { Button, ButtonGroup, DropdownButton, MenuItem, Nav, Row, Col, Image } from 'react-bootstrap';
import firebase from './../Functions/conexion'
import _ from 'underscore'

var db = firebase.database();
 
export default class SolicitationAdmin extends React.Component{
    constructor(props){
        super(props)
        this.state={
            solicitations: '',
            userSavedData:''
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
        var solicitations = db.ref('solicitations').orderByChild('date')
        solicitations.on('value',(snapshot)=>{
            that.setState({
                solicitations: snapshot.val() || ''
            })
        })
    }
    render(){
        return(
            <div className='Solicitations'>
            {this.state.userSavedData.nivel>=3?
                <Col xs={12} sm={12} md={12} lg={12}>
				<div style={{"margin":"10px", "opacity":"0.9", "height":"500px", "backgroundColor":"white","borderRadius": "10px", "overflowY": "scroll"}}>
                <h3>Solicitudes de usuario pendientes</h3>
                {this.state.solicitations == ''?
                    <h4>No hay solicitudes pendientes</h4>:
                    <Table responsive style={{'textAlign':'left'}}>
                        <thead>
                            <tr>
                                <th>UID</th>
                                <th>Nombre</th>
                                <th>Correo</th>
                                <th>Funcion</th>
                            </tr>
                        </thead>
                        <tbody>
                            {_.map(this.state.solicitations,(value,key)=>
                                <UserApprove solicitation={value} />
                            )}
                        </tbody>
                    </Table>
                }
                </div>
                </Col>:
                <h4>No tiene los permisos para ingresar a esta pagina</h4>
            }
            </div>
        )
    }
}

class UserApprove extends React.Component{
    constructor(props){
        super(props)
        this.state={
            solicitation: '',
        }
    }
    componentWillMount(){
        var that = this
        that.setState({
            solicitation: that.props.solicitation || ''
        })
    }
    componentWillReceiveProps(nextProps){
        if(this.props != nextProps){
            var that = this
            that.setState({
                solicitation: nextProps.solicitation || ''
            })
        }
    }
    habilitarVecino=()=>{
        var userQuery = db.ref('usuarios')
        var myRef = userQuery.child(this.state.solicitation.uid)
        var key = myRef.key
        var userData = {
            uid: this.state.solicitation.uid || '',
            displayName: this.state.solicitation.displayName || '',
            email : this.state.solicitation.email || '',
            photoURL: this.state.solicitation.photoURL || '',
            nivel : 1,
        }
        myRef.set(userData)
    }
    render(){
        return(
            <tr>
                <td>{this.state.solicitation.uid}</td>
                <td>{this.state.solicitation.displayName}</td>
                <td>{this.state.solicitation.email}</td>
                <td><Button bsStyle={'warning'} onClick={this.habilitarVecino}>Habilitar</Button></td>
            </tr>
        )
    }
}