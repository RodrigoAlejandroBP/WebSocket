
$(document).ready(function() {
    console.log(document.getElementById('username'));
    var b = 0;
    var contador = 0;
    var a=[]; 
    var yo;
    var listadeusuarios=[];

    
    //inicializar el puerto
    var socket = io.connect('http://127.0.0.1:5000');
    
    
    /*
    Conectarse al puerto y crear la coneccion con socket.
    */
   
    //Esta conexion es para el loby
   var socket_messages = io('http://127.0.0.1:5000/messages')
   
   
   //Iniciar socket para conversaciones privadas
   var private_socket = io('http://127.0.0.1:5000/private')
    socket.on('connect', function() 
    {
        console.log('Conectado!');
    });
    
    
    /* Para el lobby
   $('#send').on('click', function() {
       var message = $('#message').val();
   
       socket_messages.emit('message from user', message);
       
    }); */
    
  

    //Aqui registro el alias
  
    var contador=0;
   $('#send_username').on('click', function() {
            //lo emito a username de flask
            private_socket.emit('username', $('#username').val());

            yo = $('#username').val();
              //Con esta funcion comprobamos si el alias esta ocupado en en websocket deflask , else 
            private_socket.on('deflask', function(msg) {
              
                    //si da error pone una alerta
                if(msg.error=='error'){
                    $('#username').val('') ;
                    document.getElementById('Usuario').innerHTML='';
                    if(contador==0){
                        $( 'div.error' ).append('<br><br><h1 class="alert alert-danger" style="color: red; font-size: 14px;" > Este alias ya existe.</h1> <br>' );
                        contador= contador+1;
                    }
                   
                }
                //Te recibe y abre el chat
                else{
                        //Pendiente esto es para aparecer y desaparecer luego de hacer el click en enviar el usuario
                    var hola = $('#username').val();
                    document.getElementById('Usuario').innerHTML='Bienvenido '+hola+'!!';
                    $("#Desaparecer").hide(1111);
                    $("#Aparecer").show('slow');
                  
                        
                    console.log("todo correcto");
                }

            });




    });

    /*Esto es del loby tambien
    socket_messages.on('from flask', function(msg) {
        alert(msg)
    });
    */

    //Cuando un usuario envia el mensaje al otro
    $('#send_private_message').on('click', function() {

        //necesitamos saber quien lo mando,aquienva y que mensaje!.
        var emisor = $('#username').val();
        var recipient = $('#send_to_username').val();
        var message_to_send = $('#private_message').val();

        //Que no sea vacio
        if($('#private_message').val!=''){
            $('#private_message').val('');
        }

        //La hora 
        var horadeenvio=new Date();
        var hora=horadeenvio.getHours()+':'+horadeenvio.getMinutes();
        //limpiamos el mensaje
        $( '#Mensajes' ).remove();

       // console.log("esta es lista de usuarios de cuando emite")
      //  console.log(listadeusuarios);
        //comprobamos que no sea esta enviando mensajes a si mismo
        if(emisor !=recipient ){

            //se comprueba si los usuarios hablan por primera vez
            // para crear una clase  y su" propio entorno de chat"
            if(listadeusuarios.indexOf(recipient)==-1){
              
                //creo su propio holder con la clase del alias del emisor y a esa clase despues puedo hacerla desaparecer o aparecer
                $( 'div.message_holder' ).append( '<div class="'+recipient+emisor+ '"  style=""></div>');
                $( 'div'+'.'+recipient+emisor).append(' <div class="msg_bbl" style="margin-top: 15px; float: left; margin-right: 250px; ">'+'<p class = "parrafodentro" >'+message_to_send+'</p>'+ '<b style=" color: #000;font-size:10px; float: right;">   ' + hora+'</b></div>'+'<br>' );
                // $( 'div'+'.'+msg.emisor+' ).append( <div class="msg_bbl" style="margin-top: 15px; float: left; margin-right: 250px; "><p class = "parrafodentro" >'+message_to_send+'</p>'+ '<b style=" color: #000;font-size:10px; float: right;">   ' + hora+'</b></div>'+'<br>' );
                $( 'div.emisores' ).append( '<button class="btn btn-outline-success btn-block" id="'+recipient+'b" onclick=$("div.'+emisor+recipient+'").toggle();$("div.'+recipient+emisor+'").toggle();changeButtonColor("'+emisor+'b")   >'+ "Alias :  "+ recipient +'</button>');
                listadeusuarios.push(recipient);
            }
            //Si ya hablaron antes solo agrega mensajes 
            else{
                $( 'div'+'.'+recipient+emisor ).append(' <div class="msg_bbl"  style="margin-top: 15px; float: left; margin-right: 250px; ">'+'<p class = "parrafodentro" >'+message_to_send+'</p>'+ '<b style=" color: #000;font-size:10px; float: right;">   ' + hora+'</b></div>'+'<br>' );
            
            }

            //emite el mensaje privado a la otra persona para que se muestre en su pantalla, esto va a flask 
            private_socket.emit('private_message', {'username' : recipient, 'message' : message_to_send,'emisor':emisor,'hora':hora});
        }
        else{
            alert("No puedes hablar contigo mismo");
        
        }
      

       
    });
    
 

    //si termina la conexion con la otra persona no pueden hablar, se borra el entorno creado para sus mensajes
    $('#terminarconversacion').on('click', function() {
        var alias = $('#terminarconversacion1').val();
        $('#'+alias+'b').remove();
        $('div.'+alias+yo).remove();
        //lo emite a flask para que la otra persona lo reciba en el private socket que esta justo aca abajo
        private_socket.emit('borrarrastro',{'alias':alias,'yo':yo} );
        //borrar todo lo que tenga que ver con ese alias y dsps con emit avisarle al otro para que no pueda mandar mas mensajes
    });
    //recibe el mensaje de que terminaron su conexion asi que se borra con .remove
    private_socket.on('borrarrastro2', function(msg) {
        console.log("AQUIIIIIII");
        console.log('#'+msg.yo+'b' );
        $('#'+msg.yo+'b').hide();
        $('div.'+msg.yo+msg.alias).hide();
        //Tengo quqe agregar que terminaron su conexion y no puede enviarle mas mensajes

        //$( 'div'+'.'+msg.emisor+msg.receptor ).append( '<div class="msg_bbl" style="margin-top: 15px; float: right; margin-left: 250px;">'+ '<p class = "parrafodentro" >'+ msg.mensaje+ '</p>'+ '<b style="color: #000; font-size:10px; float: left;">'+ msg.hora+ '</b>'       + '</div>');
            
    });


    
    //Mensajes privados


    
//Cuando recibe el mensaje
    private_socket.on('new_private_message', function(msg) {
   
        //Comprobamos si habiamos hablado antes para crear el entorno donde chatearan, esto en la pestaña del receptor
        if(msg.hablando=="no"){       
                //como es primera vez que hablan se crea el entorno y sus botones
                $( '#Mensajes' ).remove();

               // $( 'div.message_holder' ).append( '<div class="msg_bbl"  style="margin-top: 15px; float: right; margin-left: 250px;">'+ '<p class = "parrafodentro" >'+ msg.mensaje+ '</p>'+ '<b style="color: #000; font-size:10px; float: left;">'+ msg.hora+ '</b>'   + '</div>');
                $( 'div.message_holder' ).append( '<div class="'+msg.emisor+msg.receptor+ '"  style=""></div>');
                $( 'div'+'.'+msg.emisor+msg.receptor ).append( '<div class="msg_bbl" style="margin-top: 15px; float: right; margin-left: 250px;">'+ '<p class = "parrafodentro" >'+ msg.mensaje+ '</p>'+ '<b style="color: #000; font-size:10px; float: left;">'+ msg.hora+ '</b>'   + '</div>');
                a.push(msg.emisor);
                $( 'div.emisores' ).append( '<button class="btn btn-outline-success btn-block" id="'+msg.emisor+'b" onclick=$("div.'+msg.receptor+msg.emisor+'").toggle();$("div.'+msg.emisor+msg.receptor+'").toggle(); changeButtonColor('+"+msg.emisor+'b"+') >'+ "Alias :  "+ msg.emisor +'</button>');
               
    
                b = b+1; 
                listadeusuarios.push(msg.emisor);
            

        }
        else{
            //si ya habian hablado antes solo lo añade a ese entorno de chat
            $( '#Mensajes' ).remove();
            $( 'div'+'.'+msg.emisor+msg.receptor ).append( '<div class="msg_bbl" style="margin-top: 15px; float: right; margin-left: 250px;">'+ '<p class = "parrafodentro" >'+ msg.mensaje+ '</p>'+ '<b style="color: #000; font-size:10px; float: left;">'+ msg.hora+ '</b>'       + '</div>');
            
        }
       
        
    });
    
    
}); 