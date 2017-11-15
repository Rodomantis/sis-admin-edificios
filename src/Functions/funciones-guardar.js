import firebase from './conexion'
import _ from 'underscore'

var db = firebase.database();
var qUsers = db.ref("usuarios");
var qFact = db.ref("pagoExpensas");
var qExp = db.ref("expensas");
var qVec = db.ref("vecinos");
var qDep = db.ref('departamentos');

var funciones = {
	guardarDep(idUs,nom,piso,numero,tel){
		var myRef = qDep.push();
		var key = myRef.key
		var datosDep = {
			nombreEdificio: nom,
			piso: piso,
			numero: numero,
			tel: tel,
			propietario: idUs,
		}
		myRef.set(datosDep)
	},
	guardarVecino(ciId,nom,ap,tel){
		var myRef =qVec.child(ciId)
		var key = myRef.key;
		var datosVecino = {
			nombre: nom,
			idCi: ciId,
			apellido: ap,
			telefono: tel,
		};
		myRef.set(datosVecino);
	},
	guardarFact(nom, ap, tel, fact, total){
		var myRef = qFact.push();
		var key = myRef.key;
		var datosFactura = {
			nombre: nom,
			apellido: ap,
			telefono: tel,
			detalleFactura: fact,
			totalFact: total
		};
		myRef.set(datosFactura);
	},
	guardarRecibo(id, recibo, total){
		var fecha = new Date().toJSON().slice(0,10).replace(/-/g,'/');
		var qRecibo = db.ref("recibos");
		var myRef = qRecibo.push();
		var refKey = myRef.key;
		var datosRecibo = {
			fechaRecibo: fecha,
			idVecino: id,
			totalRecibo: total
		};
		myRef.set(datosRecibo);
		_.map(recibo, (value, key)=>{
			var qPagos = db.ref('pagos')
			var pagoRef = qPagos.push()
			var datosPago = {
				idRecibo: refKey,
				codExpensa: value.codExpensa,
				costoExpensa: value.costo,
			}
			pagoRef.set(datosPago)
		})
	},
	guardarExp(nom,empresa){
		var fecha = new Date().toJSON().slice(0,10).replace(/-/g,'/');
		var myRef = qExp.push();
		var key = myRef.key;
		var datosExp = {
			nombreExpensa: nom,
			codigoExpensa: key,
			fechaRegistro: fecha,
			empresaProv: empresa,
		};
		myRef.set(datosExp);
	}, 
	guardarDatosUsuario(nomUsuario, correo, uid){
		var myRef = qUsers.child(uid);
		var key = myRef.key;
		var datosUsers = {
			nombreUsuario: nomUsuario,
			correoUsuario: correo,
			nivel: 1,
		};
		myRef.set(datosUsers);
	},
};
export default funciones