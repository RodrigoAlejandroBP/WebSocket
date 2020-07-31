
$(document).ready(function() {



   
   
 
    console.log(document.getElementById('username'));

    $( "#send_username" ).click(function() {
        var hola = $('#username').val();
        document.getElementById('Usuario').innerHTML='Bienvenido '+hola+'!!';
        $("#Desaparecer").hide(1111);
        $("#Aparecer").show('slow');
    });
    /*
    Conectarse al puerto y crear la coneccion con socket.
    */
    var socket = io.connect('http://127.0.0.1:5000');
 
    socket.on('connect', function(sock) 
        {
        console.log('Connected!');
        });

    var socket_messages = io('http://127.0.0.1:5000/messages')


    $('#send').on('click', function() {
        var message = $('#message').val();
        socket_messages.emit('message from user', message);

    });



    $('#send_username').on('click', function() {
        private_socket.emit('username', $('#username').val());

    });
    
    //Iniciar socket para conversaciones privadas

    var private_socket = io('http://127.0.0.1:5000/private')
    $('#send_private_message').on('click', function() {
        //deberia saber quien lo mando
        
        var recipient = $('#send_to_username').val();
        var message_to_send = $('#private_message').val();
        if($('#private_message').val!=''){
            $('#private_message').val('');
        }
        if($('send_to_username').val!=''){
            $('#send_to_username').val('');
        }
        private_socket.emit('private_message', {'username' : recipient, 'message' : message_to_send});
    });

    //Loby general
    socket_messages.on('from flask', function(msg) {
        alert(msg);
    });

    //Mensajes privados

    private_socket.on('new_private_message', function(msg) {
        console.log( msg )
          $( '#Mensajes' ).remove()
          $( 'div.message_holder' ).append( '<div class="msg_bbl"><b style="color: #000">'+msg.user_name+'</b> '+msg.message+'</div>' )
    });

   


    /*

    socket.on('connect', function() {
    
        socket.send('I am now connected!');

        socket.emit('custom event', {'name' : 'Anthony'});

        socket.on('from flask', function(msg) {
            alert(msg['extension']);
        });

        socket.on('message', function(msg) {
            alert(msg);
        });
        
    });
 <script src="{{ url_for('static', filename='script.js') }}"></script>-->
    */

   
});