$(document).ready(()=>{
  // Campo obligatorio:
  $.validator.addMethod("obligatorio", $.validator.methods.required, "Campo obligatorio");
  // Sólo letras (sin acentos):
  $.validator.addMethod("soloLetrasSinAcentos", function(value, element){
    return this.optional(element) || /^[a-zA-Z ]*$/.test(value);
  },"Formato incorrecto (solo letras sin acentos)");
  //Solo Numeros Enteros
  $.validator.addMethod("soloNumerosEnteros", function(value, element){
    return this.optional(element) || /[0-9]/.test(value);
  },"Formato incorrecto (solo números enteros)");
  // Correo Electronico
  $.validator.addMethod("correoElectronico", function(value, element){
    return this.optional(element) || /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(value);
  },"Formato incorrecto (correo electrónico)");
  //Agregando las clases de validacion
  //Campos obligatorios
  $.validator.addClassRules("campoObligatorio", { obligatorio: true});
  $.validator.addClassRules("soloLetrasSinAcentos", {soloLetrasSinAcentos:true}); 
  $.validator.addClassRules("soloNumerosEnteros", {soloNumerosEnteros:true});
  $.validator.addClassRules("correoElectronico", {correoElectronico:true});
})