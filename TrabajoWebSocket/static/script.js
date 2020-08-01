
$(document).ready(function() {
    console.log(document.getElementById('username'));
    var b = 0;
    var contador = 0;
    var a=[]; 
    var c=[];
    var listadeusuarios=[];
    
    //inicializar el puerto
    var socket = io.connect('http://127.0.0.1:5000');
    
    
    /*
    Conectarse al puerto y crear la coneccion con socket.
    */
   
   
   var socket_messages = io('http://127.0.0.1:5000/messages')
   
   
   //Iniciar socket para conversaciones privadas
   var private_socket = io('http://127.0.0.1:5000/private')
    socket.on('connect', function() 
    {
        console.log('Conectado!');
    });
    
    

   $('#send').on('click', function() {
       var message = $('#message').val();
       socket_messages.emit('message from user', message);
       
    });
    
    //Con esta funcion comprobamos si el alias esta ocupado en en websocket deflask , else

  
  
    

    /*Cuando ingresa el alias comprobar que no esta ocupado
    $('#send_username').on('click', function() {
        var h= c.indexOf($('#username').val());

        console.log(h);
        if(c.indexOf($('#username').val())==-1){
            c.push($('#username').val());
            var hola = $('#username').val();
            document.getElementById('Usuario').innerHTML='Bienvenido '+hola+'!!';
            $("#Desaparecer").hide(1111);
            $("#Aparecer").show('slow');
            private_socket.emit('username', $('#username').val());
        }
        else{
            if(contador ==0){
                contador = contador +1 ;
                $('#username').val('') ;
                $( 'div.error' ).append('<h1 class="alert alert-danger" style="color: red; font-size: 14px;" > error!</h1> <br>' );    
            }
            
        }
    });
    */

   $('#send_username').on('click', function() {

            private_socket.emit('username', $('#username').val());


            private_socket.on('deflask', function(msg) {
                console.log(msg.error);
                
                if(msg.error=='error'){
                    $('#username').val('') ;
                    document.getElementById('Usuario').innerHTML='';
                    $( 'div.error' ).append('<h1 class="alert alert-danger" style="color: red; font-size: 14px;" > '+msg.error+'</h1> <br>' );
                }
                else{
                        //Pendiente esto es para aparecer y desaparecer luego de hacer el click en enviar el usuario
                    var hola = $('#username').val();
                    document.getElementById('Usuario').innerHTML='Bienvenido '+hola+'!!';
                    $("#Desaparecer").hide(1111);
                    $("#Aparecer").show('slow');
                  
                        
                    console.log("todo correcto");
                }

            })




    });
    socket_messages.on('from flask', function(msg) {
        alert(msg)
    });
    
    
    /*
    private_socket.on('deflask', function(msg) {
        console.log(msg.error);
        
        if(msg.error=='error'){
            $('#username').val('') ;
            document.getElementById('Usuario').innerHTML='';
            $( 'div.error' ).append('<h1 class="alert alert-danger" style="color: red; font-size: 14px;" > '+msg.error+'</h1> <br>' );
            $("#Aparecer").hide('fast');
            $("#Desaparecer").show('fast');   
        }
        else{
                //Pendiente esto es para aparecer y desaparecer luego de hacer el click en enviar el usuario
            funcioncomprobacion();
   
            console.log("todo correcto");
        }

    });

    */
   ////private_socket.on('deflask', function(msg) {
   /// console.log(msg.error);
   /// });

    //Cuando se envia
    $('#send_private_message').on('click', function() {
        var emisor = $('#username').val();
        var recipient = $('#send_to_username').val();
        var message_to_send = $('#private_message').val();

        if($('#private_message').val!=''){
            $('#private_message').val('');
        }
        
        var horadeenvio=new Date();
        var hora=horadeenvio.getHours()+':'+horadeenvio.getMinutes();
        $( '#Mensajes' ).remove();
        if(listadeusuarios.indexOf(emisor)==-1){

            //creo su propio holder con la clase del alias del emisor y a esa clase despues puedo hacerla desaparecer o aparecer
            $( 'div.message_holder' ).append( '<div class="'+emisor+ '"  style=""></div>');
            $( 'div'+'.'+emisor ).append(' <div class="msg_bbl" style="margin-top: 15px; float: left; margin-right: 250px; ">'+'<p class = "parrafodentro" >'+message_to_send+'</p>'+ '<b style=" color: #000;font-size:10px; float: right;">   ' + hora+'</b></div>'+'<br>' );
            // $( 'div'+'.'+msg.emisor+' ).append( <div class="msg_bbl" style="margin-top: 15px; float: left; margin-right: 250px; "><p class = "parrafodentro" >'+message_to_send+'</p>'+ '<b style=" color: #000;font-size:10px; float: right;">   ' + hora+'</b></div>'+'<br>' );
            listadeusuarios.push(emisor);
        }
        else{
            $( 'div'+'.'+emisor ).append(' <div class="msg_bbl"  style="margin-top: 15px; float: left; margin-right: 250px; ">'+'<p class = "parrafodentro" >'+message_to_send+'</p>'+ '<b style=" color: #000;font-size:10px; float: right;">   ' + hora+'</b></div>'+'<br>' );
        
        }
      
        console.log(message_to_send);
        
        private_socket.emit('private_message', {'username' : recipient, 'message' : message_to_send,'emisor':emisor,'hora':hora});
    });
    
    
    
    
    //Mensajes privados

    
//Cuando llega
    private_socket.on('new_private_message', function(msg) {
        if(a.indexOf(msg.emisor)==-1){ //si el  emisor del mensaje no a mandado un mensaje previamente
            
            
            $( '#Mensajes' ).remove();
           
           // $( 'div.message_holder' ).append( '<div class="msg_bbl"  style="margin-top: 15px; float: right; margin-left: 250px;">'+ '<p class = "parrafodentro" >'+ msg.mensaje+ '</p>'+ '<b style="color: #000; font-size:10px; float: left;">'+ msg.hora+ '</b>'   + '</div>');
            $( 'div.message_holder' ).append( '<div class="'+msg.emisor+ '"  style=""></div>');
            $( 'div'+'.'+msg.emisor ).append( '<div class="msg_bbl" style="margin-top: 15px; float: right; margin-left: 250px;">'+ '<p class = "parrafodentro" >'+ msg.mensaje+ '</p>'+ '<b style="color: #000; font-size:10px; float: left;">'+ msg.hora+ '</b>'   + '</div>');
            a.push(msg.emisor);
            $( 'div.emisores' ).append( '<button class="btn btn-outline-success btn-block" id="'+msg.emisor+'" onclick="">'+"Alias :  "+ msg.emisor +'</button>');
            b = b+1; 
        }
        else{
            $( '#Mensajes' ).remove();
            //Si es que ya habia hablado contigo sigue agregando los mensajes
            $( 'div'+'.'+msg.emisor ).append( '<div class="msg_bbl" style="margin-top: 15px; float: right; margin-left: 250px;">'+ '<p class = "parrafodentro" >'+ msg.mensaje+ '</p>'+ '<b style="color: #000; font-size:10px; float: left;">'+ msg.hora+ '</b>'   + '</div>');
        }
        
    });
    
    
}); 