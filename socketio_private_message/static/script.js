
$(document).ready(function() {
    console.log(document.getElementById('username'));
    var b = 0;
    var a=[]; 
    var c=[];
    var socket = io.connect('http://127.0.0.1:5000');
 
    socket.on('connect', function(sock) 
        {
        console.log('Nos conectamos a http://127.0.0.1:5000!');
        });



    $( "#send_username" ).click(function() {
        if(c.indexOf($('#username').val())==-1){
            c.push($('#username').val());
            var hola = $('#username').val();
            document.getElementById('Usuario').innerHTML='Bienvenido '+hola+'!!';
            $("#Desaparecer").hide(1111);
            $("#Aparecer").show('slow');
        }
        else{
            console.log("taocupao");
        }

        
    });
    /*
    Conectarse al puerto y crear la coneccion con socket.
    */
    

    var socket_messages = io('http://127.0.0.1:5000/messages')


    $('#send').on('click', function() {
        var message = $('#message').val();
        socket_messages.emit('message from user', message);

    });



    $('#send_username').on('click', function() {
        
        private_socket.emit('username', $('#username').val());

    });
    
    //Iniciar socket para conversaciones privadas
    socket_messages.on('deflask', function(msg) {
        alert(msg);
        $('#username').val('') ;
        document.getElementById('Usuario').innerHTML='';
        $( 'div.error' ).append('<h1 class="alert alert-danger" style="color: red; font-size: 14px;" > '+msg.error+'</h1> <br>' );
        $("#Aparecer").hide('fast');
        $("#Desaparecer").show('fast');
    
            
        
    });

    var private_socket = io('http://127.0.0.1:5000/private')

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
        $( 'div.message_holder' ).append( '<div class="msg_bbl" style="margin-top: 15px; float: left; margin-right: 250px; "><p class = "parrafodentro" >'+message_to_send+'</p>'+ '<b style=" color: #000;font-size:10px; float: right;">   ' + hora+'</b></div>'+'<br>' );
        console.log(message_to_send);

        private_socket.emit('private_message', {'username' : recipient, 'message' : message_to_send,'emisor':emisor,'hora':hora});
    });


    

    //Mensajes privados

    
//Cuando llega
    private_socket.on('new_private_message', function(msg) {
        if(a.indexOf(msg.emisor)==-1){
            
           
            $( '#Mensajes' ).remove();
            $( 'div.message_holder' ).append( '<div class="msg_bbl" style="margin-top: 15px; float: right; margin-left: 250px;">'+ '<p class = "parrafodentro" >'+ msg.mensaje+ '</p>'+ '<b style="color: #000; font-size:10px; float: left;">'+ msg.hora+ '</b>'   + '</div>');
            a.push(msg.emisor);
            $( 'div.emisores' ).append( '<button class="btn btn-outline-success btn-block" id="'+msg.emisor+'">'+"hola soy"+ msg.emisor +'</button>');
        
     
            b = b+1; 
        }
        else{
            $( '#Mensajes' ).remove();
            $( 'div.message_holder' ).append( '<div class="msg_bbl" style="margin-top: 15px; float: right; margin-left: 250px;">'+ '<p class = "parrafodentro" >'+ msg.mensaje+ '</p>'+ '<b style="color: #000; font-size:10px; float: left;">'+ msg.hora+ '</b>'   + '</div>');
        }
        
    });
    
    
}); 