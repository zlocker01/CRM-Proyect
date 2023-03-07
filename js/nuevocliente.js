(function(){
let DB;
    const formulario = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded', () => {
        conectarDB();

        formulario.addEventListener('submit', validarCliente);
    });

    function validarCliente(e){
        e. preventDefault();

        //leer los input del form
        const nombre = document.querySelector('#nombre').value;
        const email = document.querySelector('#email').value;
        const telefono = document.querySelector('#telefono').value;
        const empresa = document.querySelector('#empresa').value;

        if(nombre === '' || email === '' || telefono === '' || empresa === ''){
            imprimirAlerta('Todos los campos son obligatorios', 'error');
            return;
        };

        //crear un objeto con la info
        const cliente = {
            nombre,
            email,
            telefono,
            empresa,
            id: Date.now()
        };

        crearNuevoCliente(cliente);
    }

        function crearNuevoCliente(cliente){
            const transaction = DB.transaction(['crm'], 'readwrite');

            const objectStore = transaction.objectStore('crm');

            objectStore.add(cliente);

            transaction.onerror = function(){
                imprimirAlerta('Hubo un error', 'error');
            }
            transaction.oncomplete = function(){
                imprimirAlerta('El cliente se agreó correctamente');
                //enviar al usuario a otra parte del HTML
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 3000);
            }
        }

        function imprimirAlerta(mensaje, tipo){
            const alerta = document.querySelector('.alerta');
        
            if(!alerta){
                    const divMensaje = document.createElement('DIV');
                    divMensaje.classList.add('alerta','px-4', 'py-4', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center', 'border');
                    
                    if(tipo === 'error'){
                divMensaje.classList.add('bg-red-100', 'border-red-400', 'text-red-700');
            } else {
                divMensaje.classList.add('bg-green-100', 'border-green-400', 'text-green-700');
            };
            
            divMensaje.textContent = mensaje;
        
            formulario.appendChild(divMensaje);
            
            setTimeout(() => {
                divMensaje.remove();
            },3000);
        };
        }

        function conectarDB(){
            const abrirConexion = window.indexedDB.open('crm', 1);
        
            abrirConexion.onerror = () => {
                console.log('Hubo un error');
            };
        
            abrirConexion.onsuccess = () => {
                DB = abrirConexion.result;
            };
        }
})();