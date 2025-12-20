const API_BASE = 'http://localhost:3000/api/clientes';

//Variable que indica tipo de acción
let clienteEditandoId = null;
let form = document.getElementById('formCliente');
let clientes = [];

window.addEventListener('load', ()=>{

    form.addEventListener('submit', guardarCliente);
    document.addEventListener('click', manejarEventos);

    obtenerClientes();
   
})

function manejarEventos(e) {

    const action = e.target.dataset.action;

    if (!action) return;

    const id = e.target.dataset.id;

    if (action === 'editar') editarCliente(id);
    if (action === 'eliminar') eliminarCliente(id);
    
}

async function editarCliente(id){

    // const cliente = await buscarClientePorId(id);
    const cliente = clientes.find(c => c._id === id);

    console.log(cliente);    

    form.nombre.value = cliente.nombre;
    form.email.value = cliente.email;
    form.telefono.value = cliente.telefono;
    form.ciudad.value = cliente.ciudad;

    clienteEditandoId = id;

}

async function eliminarCliente(id) {

    if (!confirm('Eliminar cliente?')) return;

    const resul = await apiRequest(`${API_BASE}/eliminarCliente/${id}`,'delete');
    
    obtenerClientes();
    
}

async function buscarClientePorId(id) {

    const cliente = await apiRequest(`${API_BASE}/obtenerPorId/${id}`);
    return cliente;
}

async function guardarCliente(e) {

    e.preventDefault();

    const cliente = {
        nombre: form.nombre.value,
        email: form.email.value,
        telefono: form.telefono.value,
        ciudad: form.ciudad.value
    };

    if (clienteEditandoId) {
        const resul = await apiRequest(`${API_BASE}/actualizarCliente/${clienteEditandoId}`, 'put', cliente);
        console.log(resul);        
        
    }else{
        const resul = await apiRequest(`${API_BASE}/crearCliente`, 'post', cliente);
        console.log(resul);
    }

    e.target.reset;
    obtenerClientes();   
    
}

function validarCliente(form){

    if (!form.nombre.value.trim()) return 'Nombre obligatorio';
    if (!form.email.value.includes('@')) return 'Mail malo';
    return null;
}



async function apiRequest(url, method='get', body=null){

    try {

        const config = {
            method,
            headers: {'content-type':'application/json'}
        };

        if (body) config.body = JSON.stringify(body);

        const resul = await fetch(url, config);

        if (!resul.ok) throw new Error(`Error: ${resul.status}`);

        return await resul.json();

    } catch (error) {
        return null;        
    }
}

async function obtenerClientes() {

    clientes = await apiRequest(`${API_BASE}/obtenerTodos`);
    cargarTabla(clientes);   
    
}

function cargarTabla(clientes) {

    const body = document.getElementById('tablaClientes');
    body.innerHTML = '';

    clientes.forEach(cliente => {

        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td>${cliente.nombre}</td>
            <td>${cliente.email}</td>
            <td>${cliente.telefono}</td>
            <td>${cliente.ciudad}</td>
            <td class="acciones">
                <button 
                    class="btn editar" 
                    data-action="editar" 
                    data-id="${cliente._id}">
                    Editar
                </button>
                <button 
                    class="btn eliminar" 
                    data-action="eliminar" 
                    data-id="${cliente._id}">
                    Eliminar
                </button>
            </td>
        `;

        body.appendChild(tr);
    });
}
