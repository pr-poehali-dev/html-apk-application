'''
Business: Система аутентификации и регистрации пользователей
Args: event - dict с httpMethod, body (username, email, password, action)
Returns: HTTP response с токеном или ошибкой
'''

import json
import os
import hashlib
import hmac
import time
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def create_token(user_id: int, username: str) -> str:
    data = f"{user_id}:{username}:{int(time.time())}"
    return hashlib.sha256(data.encode()).hexdigest()

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        body = json.loads(event.get('body', '{}'))
        action = body.get('action')
        
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        if action == 'register':
            username = body.get('username')
            email = body.get('email')
            password = body.get('password')
            full_name = body.get('full_name', '')
            
            if not all([username, email, password]):
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Заполните все поля'})
                }
            
            password_hash = hash_password(password)
            
            cur.execute(
                "INSERT INTO users (username, email, password_hash, full_name) VALUES (%s, %s, %s, %s) RETURNING id, username, email, is_admin",
                (username, email, password_hash, full_name)
            )
            user = cur.fetchone()
            conn.commit()
            
            token = create_token(user['id'], user['username'])
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'success': True,
                    'token': token,
                    'user': {
                        'id': user['id'],
                        'username': user['username'],
                        'email': user['email'],
                        'is_admin': user['is_admin']
                    }
                })
            }
        
        elif action == 'login':
            username = body.get('username')
            password = body.get('password')
            
            if not all([username, password]):
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Заполните все поля'})
                }
            
            password_hash = hash_password(password)
            
            cur.execute(
                "SELECT id, username, email, is_admin FROM users WHERE username = %s AND password_hash = %s",
                (username, password_hash)
            )
            user = cur.fetchone()
            
            if not user:
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Неверный логин или пароль'})
                }
            
            cur.execute(
                "UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = %s",
                (user['id'],)
            )
            conn.commit()
            
            token = create_token(user['id'], user['username'])
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'success': True,
                    'token': token,
                    'user': {
                        'id': user['id'],
                        'username': user['username'],
                        'email': user['email'],
                        'is_admin': user['is_admin']
                    }
                })
            }
        
        else:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Неизвестное действие'})
            }
    
    except psycopg2.IntegrityError as e:
        if conn:
            conn.rollback()
        return {
            'statusCode': 409,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Пользователь с таким именем или email уже существует'})
        }
    
    except Exception as e:
        if conn:
            conn.rollback()
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'Ошибка сервера: {str(e)}'})
        }
    
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()
