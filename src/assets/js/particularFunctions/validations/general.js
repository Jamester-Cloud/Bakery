$(document).ready(function(){
	$("#perfilForm").validate({ // Validacion perfil
		//Agregando estilos a los errores
		highlight: function(element) {
          $(element).closest('.form-group').removeClass('has-success').addClass('has-danger');
        },
        unhighlight: function (element) {
          $(element).removeClass('has-danger').addClass('has-success');
        },                
        success: function(element) {
          $(element).closest('.form-group').removeClass('has-danger').addClass('has-success');
        },
        errorPlacement: function(error, element) {
            $(element).closest('.form-control').append(error);
          },
  	  	submitHandler: function(form) {
  	      form.submit();
  	  	}
    });
    //
  $("#categoryForm").validate({ // Validacion Categoria
		//Agregando estilos a los errores
		highlight: function(element) {
          $(element).closest('.form-group').removeClass('has-success').addClass('has-danger');
        },
        unhighlight: function (element) {
          $(element).removeClass('has-danger').addClass('has-success');
        },                
        success: function(element) {
          $(element).closest('.form-group').removeClass('has-danger').addClass('has-success');
        },
        errorPlacement: function(error, element) {
            $(element).append(error);
        },
    	  submitHandler: function(form) {
    	    form.submit();
    	  }
    });
    //
  $("#articulo").validate({ // Validacion articulo
		//Agregando estilos a los errores
		highlight: function(element) {
          $(element).closest('.form-group').removeClass('has-success').addClass('has-danger');
        },
        unhighlight: function (element) {
          $(element).removeClass('has-danger').addClass('has-success');
        },                
        success: function(element) {
          $(element).closest('.form-group').removeClass('has-danger').addClass('has-success');
        },
        errorPlacement: function(error, element) {
            $(element).append(error);
        },
    	  submitHandler: function(form) {
    	    form.submit();
    	  }
    });
    //
  $("#cliente").validate({ // Validacion del cliente
		//Agregando estilos a los errores
		highlight: function(element) {
          $(element).closest('.form-group').removeClass('has-success').addClass('has-danger');
        },
        unhighlight: function (element) {
          $(element).removeClass('has-danger').addClass('has-success');
        },                
        success: function(element) {
          $(element).closest('.form-group').removeClass('has-danger').addClass('has-success');
        },
        errorPlacement: function(error, element) {
            $(element).append(error);
        },
    	  submitHandler: function(form) {
    	    form.submit();
    	  }
    });
  $("#usuarios").validate({ // Validacion del cliente
		    //Agregando estilos a los errores
		    highlight: function(element) {
          $(element).closest('.form-group').removeClass('has-success').addClass('has-danger');
        },
        unhighlight: function (element) {
          $(element).removeClass('has-danger').addClass('has-success');
        },                
        success: function(element) {
          $(element).closest('.form-group').removeClass('has-danger').addClass('has-success');
        },
        errorPlacement: function(error, element) {
            $(element).append(error);
        },
	      submitHandler: function(form) {
	        form.submit(); // envio del formulario
	      }
    });
  $("#searchEngine").validate({ // Validacion del cliente
        //Agregando estilos a los errores
        highlight: function(element) {
          $(element).closest('.form-group').removeClass('has-success').addClass('has-danger');
        },
        unhighlight: function (element) {
          $(element).removeClass('has-danger').addClass('has-success');
        },                
        success: function(element) {
          $(element).closest('.form-group').removeClass('has-danger').addClass('has-success');
        },
        errorPlacement: function(error, element) {
            $(element).append(error);
        },
        submitHandler: function(form) {
          form.submit(); // envio del formulario
        }
    });
})