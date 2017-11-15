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
            db.ref('usuarios').on('value',(userSnapshot)=>{
                var solicitudes = snapshot.val()
                var llavesUsuarios = []
                var users = ''
                users = userSnapshot.val()
                llavesUsuarios = _.allKeys(users)
                console.log(llavesUsuarios)
                that.setState({
                    solicitations: _.pick(solicitudes,(value,key)=>
                        !(_.contains(llavesUsuarios,value.uid))
                    )
                })
            })
        })
    }
    render(){
        return(
            <div className='Solicitations'>
            {this.state.userSavedData.nivel>=3?
				<div>
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
                </div>:
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