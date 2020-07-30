$(document).ready(function() {

    function myFunc(vars) {
        return vars
    }
    
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

    socket_messages.on('from flask', function(msg) {
        alert(msg);
    });

    socket.on('server orginated', function(msg) {
        alert(msg);
    });

    var private_socket = io('http://127.0.0.1:5000/private')


     private_socket.emit({{data}});
   


    $('#send_private_message').on('click', function() {
        var recipient = $('#send_to_username').val();
        var message_to_send = $('#private_message').val();


        private_socket.emit('private_message', {'username' : recipient, 'message' : message_to_send});
    });

    private_socket.on('new_private_message', function(msg) {
        alert(msg);
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