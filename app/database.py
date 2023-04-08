import json
import psycopg2
from .user import User


with open('app/config/database_config.json') as config_file, \
        open('app/config/database_password', 'r') as password_file:
    config = json.load(config_file)
    config['password'] = password_file.read()
connection = psycopg2.connect(**config)


def get_user(user_id):
    with connection.cursor() as cursor:
        try:
            cursor.execute(
                'SELECT username FROM simulation.users WHERE id = %s', (user_id,))
            result = cursor.fetchall()

        except Exception as e:
            print(e)
            connection.rollback()
            return None

    username = result[0][0] if result else None
    if username is not None:  # if user exists
        return User(user_id, username)
    else:
        return None


def get_user_with_authentication(username, password):
    with connection.cursor() as cursor:
        try:
            cursor.execute(
                'SELECT id FROM simulation.users WHERE username = %s AND password = %s', (username, password))
            result = cursor.fetchall()
        except Exception as e:
            print(e)
            connection.rollback()
            return None

    id = result[0][0] if result else None
    if id is not None:  # if user exists and password matches
        return get_user(id)
    else:
        return None


def create_user(username, password):
    with connection.cursor() as cursor:
        try:
            cursor.execute(
                '''INSERT INTO simulation.users ("username", "password") VALUES (%s, %s)''', (username, password))
            if cursor.rowcount == 0:
                connection.rollback()
                return False

            connection.commit()
            return True
        except Exception as e:
            print(e)
            connection.rollback()
            return False


def get_user_configurations(user_id):
    with connection.cursor() as cursor:
        try:
            cursor.execute(
                'SELECT name, mass_ratio, left_ball_color, right_ball_color'
                ' FROM simulation.configurations'
                ' WHERE user_id = %s'
                ' ORDER BY name',
                (user_id,),
            )
            result = cursor.fetchall()
        except Exception as e:
            print(e)
            connection.rollback()
            return

    configurations = []
    for row in result:
        configurations.append({
            'name': row[0],
            'mass_ratio': row[1],
            'left_ball_color': row[2],
            'right_ball_color': row[3],
        })

    return configurations


def add_user_configuration(user_id, configuration):
    with connection.cursor() as cursor:
        try:
            cursor.execute(
                'DELETE FROM simulation.configurations'
                ' WHERE user_id = %s AND name = %s',
                (user_id, configuration['name']),
            )
            cursor.execute(
                'INSERT INTO simulation.configurations (user_id, name, mass_ratio, left_ball_color, right_ball_color)'
                ' VALUES (%s, %s, %s, %s, %s)',
                (
                    user_id,
                    configuration['name'],
                    configuration['mass_ratio'],
                    configuration['left_ball_color'],
                    configuration['right_ball_color'],
                )
            )
            connection.commit()
        except Exception as e:
            print(e)
            connection.rollback()
            return


def remove_user_configuration(user_id, configuration_name):
    with connection.cursor() as cursor:
        try:
            cursor.execute(
                'DELETE FROM simulation.configurations'
                ' WHERE user_id = %s AND name = %s',
                (user_id, configuration_name),
            )
            connection.commit()
        except Exception as e:
            print(e)
            connection.rollback()
            return
