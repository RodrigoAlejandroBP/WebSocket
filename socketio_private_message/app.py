from flask import Flask, render_template, request,redirect, url_for
from flask_socketio import SocketIO, send, emit
import json


app = Flask(__name__)
app.config['SECRET_KEY'] = 'colaslowpoke'
app.config['DEBUG'] = True


#cors , para que cualquiera pueda realizar la conexion
socketio = SocketIO(app,cors_allowed_origins="*")


users = {}

historialmensajes=[]




#Con render template, mostramos el index html
#ruta inicial
@app.route('/', methods=['GET', 'POST'])
def salachat():
    error = None
    return render_template('index.html',error=error)

@socketio.on('message from user', namespace='/messages')
def receive_message_from_user(message):
    print('USER MESSAGE: {}'.format(message))
    emit('from flask', message.upper(), broadcast=True)

@socketio.on('username', namespace='/private')
def receive_username(username):
    users[username] = request.sid
    #users.append({username : request.sid})
    #print(users)
    print(users)
    emit('alias',username)

@socketio.on('private_message', namespace='/private')
def private_message(payload):
    recipient_session_id = users[payload['username']]
    message = payload['message']

    #Agrego a los dos que conversaron  
    historialmensajes.append()
    emit('new_private_message', message, room=recipient_session_id)

'''
@socketio.on('message')
def receive_message(message):
    print('########: {}'.format(message))
    send('This is a message from Flask.')

@socketio.on('custom event')
def receive_custom_event(message):
    print('THE CUSTOM MESSAGE IS: {}'.format(message['name']))
    emit('from flask', {'extension' : 'Flask-SocketIO'}, json=True)

'''

if __name__ == '__main__':
    socketio.run(app)