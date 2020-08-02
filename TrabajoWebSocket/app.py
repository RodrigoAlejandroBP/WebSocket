from flask import Flask, render_template, request,redirect, url_for
from flask_socketio import SocketIO, send, emit,join_room, leave_room
import json


app = Flask(__name__)
app.config['SECRET_KEY'] = 'colaslowpoke'
app.config['DEBUG'] = True


#cors , para que cualquiera pueda realizar la conexion
socketio = SocketIO(app,cors_allowed_origins="*")

#Para guardar los alias y sus id unicas
users = {}

#Se guardan los alias aqui para posterior comprobacion
alias=[]

#lista para saber quienes estan hablando
estanhablando=[]

#No ha sido  utilizada
usuariosconectados=[]




#Con render template, mostramos el index html
#ruta inicial
@app.route('/', methods=['GET', 'POST'])
def salachat():
    error = None
    return render_template('index.html',error=error)


#Este es usado para mandar al loby
#@socketio.on('message from user', namespace='/messages')
#def receive_message_from_user(message):
#    print('USER MESSAGE: {}'.format(message))
#    emit('from flask', message.upper(), broadcast=True)


#Esto es para recibir el alias, si es que ya 
# esta ocupado lo emitimos a deflask para decirle y emitirle el error a quien 
#intenta ingresarlo
@socketio.on('username', namespace='/private')
def receive_username(username):

    if(username in alias):
        message={'error':"error"}
    else:
        alias.append(username)
        users[username] = request.sid
        message={'error':"correcto"}

    emit('deflask',message)
 

#Para terminar la conexion definitivamente
@socketio.on('borrarrastro', namespace='/private')
def receive_username(payload):

    recipient_session_id = users[payload['alias']]

    print("pase por obrrarrastro")
    message = {'alias':payload["alias"],'yo':payload["yo"]}
    emit('borrarrastro2',message,room=recipient_session_id)
  

def mensajerecibido():
  print( 'Mensaje recibido!!!' )


@socketio.on('private_message', namespace='/private')
def private_message(payload):

#Añadimos a estas listas globales quienes se estan hablando en distinto orden por si acaso
    mensajeros=[payload['emisor'],payload['username']]
    mensajeros2=[payload['username'],payload['emisor']]
   # print("mensajeros")
    #print(mensajeros)

    #Obtenemos la id unica del que esta hablando para enviarlo a su lobby o sala de chat privada
    recipient_session_id = users[payload['username']]

    #print(recipient_session_id)
    #print(payload)

    #comprobacion si es que los mensajeros ya habian hablado, cambia solo la parte del diccionario 
    #"hablando" para hacer una comprobacion en el script
    if((mensajeros in estanhablando ) or (mensajeros2 in estanhablando) ):
        message = {'mensaje':payload['message'],'emisor':payload['emisor'],'hora':payload['hora'],'receptor':payload['username'],'hablando':'si'}
    else:
        message = {'mensaje':payload['message'],'emisor':payload['emisor'],'hora':payload['hora'],'receptor':payload['username'],'hablando':'no'}
    
    #Si es que no estan hablando los agrego a esa lista global
    if(mensajeros in estanhablando):
        print("ya estan hablando")
    else:
        estanhablando.append(mensajeros)
        estanhablando.append(mensajeros2)
    print(message)


    #Agrego a los dos que conversaron  
    #envio finalmente el mensaje y sus datos
    usuariosconectados.append([ users[payload['username']],payload['emisor'] ])
    emit('new_private_message', message, room=recipient_session_id,callback=mensajerecibido())




if __name__ == '__main__':
    socketio.run(app)