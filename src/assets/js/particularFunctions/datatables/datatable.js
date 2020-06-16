$(document).ready(function() {
    $('#producto').DataTable(); // funcion de datatables en general(Aplica para la mayoria de las tablas presentes en el sistema)
    // comienzo de funciones distintivas para casos de mas de una datatable en la pagina
    $('#pedido_confirmado').DataTable();
    $('#pedidosCancelado').DataTable();
} );