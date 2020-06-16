$(document).ready(function(){
	$("#pass").keyup(function(){ // evento en keyup al presionar teclas ocurriran las operaciones de comparacion de caracteres
		var valor = $(this).val();
		if( valor.length >= 8 && valor.length <= 16 ) {
      		$('#length').removeClass('text-danger').addClass('text-success');
    	}
    	else{
    		$('#length').removeClass('text-success').addClass('text-danger');
    	}

    	if( /[a-z]/.test(valor) ) { // Una letra minisculas
      		$('#letter').removeClass('text-danger').addClass('text-success');
    	}
    	else{
    		$('#letter').removeClass('text-success').addClass('text-danger');
    	}

    	if( /[A-Z]/.test(valor) ) { // Una letra Mayusculas
      		$('#capital').removeClass('text-danger').addClass('text-success');
    	}
    	else{
    		$('#capital').removeClass('text-success').addClass('text-danger');
    	}

    	if( /\d/.test(valor) ) { // Un numero
      		$('#number').removeClass('text-danger').addClass('text-success');
    	}
    	else{
    		$('#number').removeClass('text-success').addClass('text-danger');
    	}

    	if( /[.:;¡!#&¿?=$/*%@()+-]/.test(valor) ) { // Un simbolo especial
      		$('#simbol').removeClass('text-danger').addClass('text-success');
    	}
    	else{
    		$('#simbol').removeClass('text-success').addClass('text-danger');
    	}
	})
})