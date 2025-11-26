'''
Business: API для управления турнирами (создание, просмотр, поиск, регистрация)
Args: event - dict с httpMethod, body, queryStringParameters
Returns: HTTP response со списком турниров или результатом операции
'''

import json
import os
from typing import Dict, Any, List
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    try:
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        if method == 'GET':
            params = event.get('queryStringParameters') or {}
            search = params.get('search', '')
            status = params.get('status', '')
            
            query = "SELECT * FROM tournaments WHERE 1=1"
            query_params = []
            
            if search:
                query += " AND (name ILIKE %s OR description ILIKE %s)"
                search_pattern = f'%{search}%'
                query_params.extend([search_pattern, search_pattern])
            
            if status:
                query += " AND status = %s"
                query_params.append(status)
            
            query += " ORDER BY start_date DESC"
            
            cur.execute(query, query_params)
            tournaments = cur.fetchall()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'tournaments': [dict(t) for t in tournaments]
                }, default=str)
            }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            action = body.get('action')
            
            headers = event.get('headers', {})
            user_id = headers.get('X-User-Id') or headers.get('x-user-id')
            
            if action == 'create':
                name = body.get('name')
                description = body.get('description', '')
                prize_money = body.get('prize_money', '')
                max_participants = body.get('max_participants', 64)
                start_date = body.get('start_date')
                game_title = body.get('game_title', '')
                tournament_format = body.get('tournament_format', 'Single Elimination')
                rules = body.get('rules', '')
                image_url = body.get('image_url', '')
                
                if not name:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Название турнира обязательно'})
                    }
                
                cur.execute(
                    """INSERT INTO tournaments 
                    (name, description, prize_money, max_participants, start_date, game_title, tournament_format, rules, image_url, created_by) 
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s) 
                    RETURNING *""",
                    (name, description, prize_money, max_participants, start_date, game_title, tournament_format, rules, image_url, user_id)
                )
                tournament = cur.fetchone()
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'success': True,
                        'tournament': dict(tournament)
                    }, default=str)
                }
            
            elif action == 'register':
                tournament_id = body.get('tournament_id')
                
                if not user_id:
                    return {
                        'statusCode': 401,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Необходима авторизация'})
                    }
                
                cur.execute(
                    "INSERT INTO tournament_participants (tournament_id, user_id) VALUES (%s, %s) RETURNING *",
                    (tournament_id, user_id)
                )
                participant = cur.fetchone()
                
                cur.execute(
                    "UPDATE tournaments SET current_participants = current_participants + 1 WHERE id = %s",
                    (tournament_id,)
                )
                
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'success': True,
                        'message': 'Вы успешно зарегистрированы на турнир'
                    })
                }
            
            else:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Неизвестное действие'})
                }
        
        elif method == 'PUT':
            body = json.loads(event.get('body', '{}'))
            tournament_id = body.get('id')
            
            update_fields = []
            update_values = []
            
            for field in ['name', 'description', 'status', 'prize_money', 'max_participants', 'start_date', 'game_title', 'rules', 'image_url']:
                if field in body:
                    update_fields.append(f"{field} = %s")
                    update_values.append(body[field])
            
            if not update_fields:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Нет полей для обновления'})
                }
            
            update_fields.append("updated_at = CURRENT_TIMESTAMP")
            update_values.append(tournament_id)
            
            query = f"UPDATE tournaments SET {', '.join(update_fields)} WHERE id = %s RETURNING *"
            cur.execute(query, update_values)
            tournament = cur.fetchone()
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'success': True,
                    'tournament': dict(tournament)
                }, default=str)
            }
        
        else:
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Method not allowed'})
            }
    
    except psycopg2.IntegrityError as e:
        if conn:
            conn.rollback()
        return {
            'statusCode': 409,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Вы уже зарегистрированы на этот турнир'})
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
