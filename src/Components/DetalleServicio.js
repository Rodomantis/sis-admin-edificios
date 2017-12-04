import React, { Component } from 'react';
import _ from 'underscore'
import Link from 'react-router/lib/Link'
import { Grid, Table } from 'react-bootstrap';
import { Nav, Row, Col, Image } from 'react-bootstrap';
import firebase from './../Functions/conexion'

export default class DetalleServicio extends React.Component{
    constructor(props){
        super(props)
        this.state={
            pagosExpensa:'',
            recibos: '',
            expensa: ''
        }
    }
    componentWillMount(){
        var that = this
        var llavesRecibos = []
        firebase.database().ref('gastosExpensas').orderByChild('codGasto').equalTo(this.props.params.idServicio).on('value',(snapshot)=>{
            that.setState({
                pagosExpensa: snapshot.val()
            })
        })
    }
    render(){
        return(
            <div className='DetalleServicio'>
                <h4>Pagos del servicio <b>{this.state.expensa.nombreExpensa}</b> de la empresa <b>{this.state.expensa.empresaProv}</b></h4>
                <h4>Usuario: <b>{this.props.params.userId}</b> Departamento: <b>{this.props.params.idDep}</b></h4>
                <Table responsive style={{'textAlign':'left'}}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Cod Expensa</th>
                            <th>Expensa</th>
                            <th>Empresa</th>
                        </tr>
                    </thead>
                    <tbody>
                        {_.map(this.state.pagosExpensa,(value,key)=>
                            <tr>
                                <td>{key || ''}</td>
                                <td>{value.codExpensa || ''}</td>
                                <td>{value.nombreExpensa || ''}</td>
                                <td>{value.empresaProv || ''}</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
        )
    }
}