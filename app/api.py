import json
from flask import Blueprint, request
from flask_login import current_user, login_user, logout_user
from . import database

api = Blueprint('api', __name__)


@api.route('/login', methods=['POST'])
def login():
    data = json.loads(request.data)
    user = database.get_user_with_authentication(
        data['username'], data['password'])
    return json.dumps({'success': user is not None and login_user(user)})


@api.route('/register', methods=['POST'])
def register():
    data = json.loads(request.data)
    success = database.create_user(data['username'], data['password'])
    return json.dumps({'success': success})


@api.route('/logout', methods=['POST'])
def logout():
    return json.dumps({'success': logout_user()})


@api.route('/users/<user_id>/configurations')
def get_user_configurations(user_id):
    result = {'success': False}

    if current_user.is_authenticated:
        if user_id == 'current':
            user_id = current_user.get_id()

        if current_user.get_id() == user_id:
            result['success'] = True
            result['configurations'] = database.get_user_configurations(
                user_id)

    return json.dumps(result)


@api.route('/users/<user_id>/configurations/<configuration_name>')
def get_user_configuration(user_id, configuration_name):
    result = {'success': False}

    if current_user.is_authenticated:
        if user_id == 'current':
            user_id = current_user.get_id()

        configurations = database.get_user_configurations(user_id)
        for configuration in configurations:
            if configuration['name'] == configuration_name:
                result['success'] = True
                result['configuration'] = configuration

    return json.dumps(result)


@api.route('/users/<user_id>/configurations', methods=['POST'])
def add_user_configuration(user_id):
    if current_user.is_authenticated and user_id == 'current':
        user_id = current_user.get_id()

    database.add_user_configuration(user_id, json.loads(request.data))

    return json.dumps({'success': True})


@api.route('/users/<user_id>/configurations/<configuration_name>', methods=['DELETE'])
def remove_user_configuration(user_id, configuration_name):
    result = {'success': False}

    if current_user.is_authenticated:
        if user_id == 'current':
            user_id = current_user.get_id()

        database.remove_user_configuration(user_id, configuration_name)
        result['success'] = True

    return json.dumps(result)
