import React, { Component } from 'react';
import logo from './logo.svg';
import Estilos from './../Styles/estilos-react';
import {Grid} from 'react-bootstrap'
import Menu from './Menu'
import './App.css';

export default class App extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <div className='App' style={Estilos.fondoPrincipal}>
                    <Menu />
                    <Grid>
                        {this.props.children}
                    </Grid>
                </div>
            </div>
        );
    }
}

