import React, { Component } from 'react';
import background from './../Images/background.jpg';
//para importar direcciones de imagenes se usa el import
var Estilos = {
  bigblue: {
    color: 'blue',
    fontWeight: 'bold',
    fontSize: 30,
  },
  red: {
    color: 'red',
  },
  fondoPrincipal: {
	backgroundImage: 'url('+background+')',
	minHeight:650,
	float: 'none',
  },
  estiloLogin: {
	flex: 1,
  }
};

export default Estilos;