/**
	@file Contiene la vista de modificar.
	@author David Pérez Saché <dperezsache.guadalupe@alumnado.fundacionloyola.net>
	@license GPL-3.0-or-later
**/

import {Vista} from './vista.js';

/**
	Vista de la página de modificar.
**/
export class VistaModificar extends Vista
{
    /**
		Constructor de la clase.
		@param {Controlador} controlador Controlador de la vista.
		@param {HTMLDivElement} div Div de HTML en el que se desplegará la vista.
	**/
    constructor(controlador, div) 
	{
        super(controlador, div);

		this.modelo = this.controlador.getModelo();
		this.modelo.registrar(this.cargarListado.bind(this));

		// Coger referencias de los elementos
		this.listado = this.div.getElementsByTagName('select')[0];
		this.campoNombre = this.div.getElementsByTagName('input')[0];
		this.campoFecha = this.div.getElementsByTagName('input')[1];
		this.campoPrecio = this.div.getElementsByTagName('input')[2];
		this.campoDescripcion = this.div.getElementsByTagName('textarea')[0];
		this.campoTipo = this.div.getElementsByTagName('select')[1];
		this.campoImagen = this.div.getElementsByTagName('input')[3];
		this.seguro1 = this.div.getElementsByTagName('input')[4];
		this.seguro2 = this.div.getElementsByTagName('input')[5];
		this.seguro3 = this.div.getElementsByTagName('input')[6];
		this.botonCancelar = this.div.getElementsByTagName('button')[0];
		this.botonAceptar = this.div.getElementsByTagName('button')[1];
		this.parrafoAviso = this.div.getElementsByClassName('pAviso')[0];
		
		// Asignar eventos.
		this.listado.onclick = this.actualizarForm.bind(this);
		this.botonAceptar.onclick = this.aceptar.bind(this);
		this.botonCancelar.onclick = this.cancelar.bind(this);
    }

	/**
		Actualiza el formulario con los datos del personaje seleccionado.
	**/
	actualizarForm() 
	{
		let componentes = this.modelo.getLista();
		let dato = null;

		if(componentes != null) 
		{
			for(let componente of componentes) 
			{
				if(componente.id == this.listado.value) 
				{
					dato = componente;
					break;
				}
			}

			if(dato != null) 
			{
				this.campoNombre.value = dato.nombre;
				this.campoFecha.value = dato.fecha;
				this.campoPrecio.value = dato.precio;
				this.campoDescripcion.value = dato.descripcion;
				this.campoTipo.value = dato.tipo;
				this.seguro1.checked = dato.seguro1;
				this.seguro2.checked = dato.seguro2;
				this.seguro3.checked = dato.seguro3;
			}
		}
	}

	/**
		Carga el listado de componentes a actualizar. 
	**/
	cargarListado()
	{
		this.borrarListado();
		let componentes = this.modelo.getLista();

		if(componentes != null)
		{
			let primeraOpcion = document.createElement('option');
			primeraOpcion.textContent = '-- Selecciona componente --';
			primeraOpcion.setAttribute('value', '-1');
			primeraOpcion.setAttribute('disabled', '');
			primeraOpcion.setAttribute('selected', '');
			this.listado.appendChild(primeraOpcion);

			for(let componente of componentes)
			{
				let option = document.createElement('option');
				option.setAttribute('value', componente.id);
				option.textContent = componente.nombre;
				this.listado.appendChild(option);
			}
		}
	}

	/**
		Atención al click de aceptar actualización.
	**/
	aceptar()
	{
		const colorOk = '1px solid #ADACAC'; 
		const colorMal = '1px solid crimson';
		let cont = 0;

		// Validación listado
		if (this.listado.value != -1)
		{
			cont++;
			this.listado.style.border = colorOk;
		}
		else
		{
			this.listado.style.border = colorMal;
		}

		// Validación nombre
		if (this.campoNombre.value && this.campoNombre.value.length <= 50) 
		{
			cont++;
			this.campoNombre.style.border = colorOk;
		}
		else 
		{
			this.campoNombre.style.border = colorMal;
		}

		// Validación fecha
		if (this.campoFecha.value) 
		{
			cont++;
			this.campoFecha.style.border = colorOk;
		}
		else 
		{
			this.campoFecha.style.border = colorMal;
		}

		// Validación precio
		if (this.campoPrecio.value && !isNaN(this.campoPrecio.value) && this.campoPrecio.value > 0) 
		{
			cont++;
			this.campoPrecio.style.border = colorOk;
		}
		else 
		{
			this.campoPrecio.style.border = colorMal;
		}

		// Validación tipo
		if (this.campoTipo.value != -1)
		{
			cont++;
			this.campoTipo.style.border = colorOk;
		}
		else
		{
			this.campoTipo.style.border = colorMal;
		}

		// Validación descripción
		if (this.campoDescripcion.value && this.campoDescripcion.value.length <= 500)
		{
			cont++;
			this.campoDescripcion.style.border = colorOk;
		}
		else
		{
			this.campoDescripcion.style.border = colorMal;
		}

		// Validación imagen
		if (this.campoImagen.files[0] != null)
		{
			cont++;
			this.campoImagen.style.border = colorOk;
		}
		else
		{
			this.campoImagen.style.border = colorMal;
		}

		window.scrollTo(0, 0);	// Mover al top de la página.
		this.parrafoAviso.style.display = 'block';

		if(cont == 7) 
		{
			this.parrafoAviso.innerText = '✔️ Componente actualizado correctamente ✔️';

			this.controlador.actualizarCRUD(
				this.listado.value,
				this.campoNombre.value, 
				this.campoFecha.value, 
				this.campoPrecio.value,
				this.campoDescripcion.value, 
				this.campoTipo.value,
				this.campoImagen.files[0], 
				this.seguro1.checked,
				this.seguro2.checked,
				this.seguro3.checked
			);

			this.cancelar();	// Borrar los campos una vez modificado el elemento.
		}
		else
		{
			this.parrafoAviso.innerText = '⚠️ Rellena correctamente los campos indicados ⚠️';
		}
	}

	/**
		Limpiar los campos del formulario.
	**/
	cancelar()
	{
		this.campoNombre.value = '';
		this.campoFecha.value = '';
		this.campoPrecio.value = '';
		this.campoDescripcion.value = '';
		this.campoTipo.value = -1;
		this.campoImagen.value = '';
		this.seguro1.checked = false;
		this.seguro2.checked = false;
		this.seguro3.checked = false;
	}

	/**
		Borra los options del select.
	**/
	borrarListado()
	{
		while(this.listado.firstElementChild)
			this.listado.firstElementChild.remove();
	}

	mostrar(ver)
	{
		super.mostrar(ver);
		this.parrafoAviso.style.display = 'none';
	}
}