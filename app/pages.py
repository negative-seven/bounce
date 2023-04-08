from flask import Blueprint, render_template

pages = Blueprint('pages', __name__)


@pages.route('/')
def index():
    return render_template('index.html')


@pages.route('/description')
def description():
    return render_template('description.html')


@pages.route('/login')
def login():
    return render_template('login.html')


@pages.route('/register')
def register():
    return render_template('register.html')
