from flask import Flask, render_template, request,redirect, url_for
from flask_socketio import SocketIO, send, emit,join_room, leave_room
import json


app = Flask(__name__)
app.config['SECRET_KEY'] = 'colaslowpoke'
app.config['DEBUG'] = True


#cors , para que cualquiera pueda realizar la conexion
socketio = SocketIO(app,cors_allowed_origins="*")


users = {}
alias=[]
usuariosconectados=[]




#Con render template, mostramos el index html
#ruta inicial
@app.route('/', methods=['GET', 'POST'])
def salachat():
    error = None
    return render_template('index.html',error=error)
#
#@socketio.on('message from user', namespace='/messages')
#def receive_message_from_user(message):
#    print('USER MESSAGE: {}'.format(message))
#    emit('from flask', message.upper(), broadcast=True)


#Acepto el alias
@socketio.on('username', namespace='/private')
def receive_username(username):
    message={'error':"error"}
    alias.append(username)
    users[username] = request.sid
    emit('alias',username)
 
 

def mensajerecibido():
  print( 'Mensaje recibido!!!' )


@socketio.on('private_message', namespace='/private')
def private_message(payload):

    recipient_session_id = users[payload['username']]
    print(recipient_session_id)
    print(payload)
    message = {'mensaje':payload['message'],'emisor':payload['emisor'],'hora':payload['hora']}
    print(message)


    #Agrego a los dos que conversaron  
    usuariosconectados.append([ users[payload['username']],payload['emisor'] ])
    emit('new_private_message', message, room=recipient_session_id,callback=mensajerecibido())



if __name__ == '__main__':
    socketio.run(app)