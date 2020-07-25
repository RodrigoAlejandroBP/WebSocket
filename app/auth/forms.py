from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, PasswordField, BooleanField
from wtforms.validators import DataRequired, Email, Length

class SignupForm(FlaskForm):
    name = StringField('Nombre', validators=[DataRequired(message="Campo requerido"), Length(max=64, message="No puede exceder los 64 caracteres")])
    password = PasswordField('Password', validators=[DataRequired(message="Campo requerido")])
    email = StringField('Email', validators=[DataRequired(message="Campo requerido"), Email(message="Se requiere un email")])
    submit = SubmitField('Registrar')

class LoginForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(message="Campo requerido")])
    password = PasswordField('Password', validators=[DataRequired(message="Campo requerido")])
    remember_me = BooleanField('Recuérdame')
    submit = SubmitField('Login')