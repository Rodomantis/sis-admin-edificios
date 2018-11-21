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
        var counter = 0
        return(
            <div className='DetalleServicio'>
                <h4>Pagos del servicio <b>{this.state.expensa.nombreExpensa}</b> de la empresa <b>{this.state.expensa.empresaProv}</b></h4>
                <h4> Codigo Usuario: <b>{this.props.params.userId}</b></h4>
                <h4> Codigo Departamento: <b>{this.props.params.idDep}</b></h4>
                <Table responsive style={{'textAlign':'left'}}>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Codigo Servicio</th>
                            <th>Expensa</th>
                            <th>Empresa</th>
                        </tr>
                    </thead>
                    <tbody>
                        {_.map(this.state.pagosExpensa,(value,key)=>{
                            counter = counter+1
                            return <tr>
                                <td>{counter || ''}</td>
                                <td>{value.codExpensa || ''}</td>
                                <td>{value.nombreExpensa || ''}</td>
                                <td>{value.empresaProv || ''}</td>
                            </tr>
                        })}
                    </tbody>
                </Table>
            </div>
        )
    }
}