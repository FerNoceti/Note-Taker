import jwt
from datetime import datetime, timedelta
from flask import current_app
from ..models.user_model import User
from app import db


class AuthService:
    @staticmethod
    def generate_token(user_id):
        payload = {
            'exp': datetime.utcnow() + timedelta(hours=24),
            'iat': datetime.utcnow(),
            'sub': str(user_id)
        }

        secret_key = current_app.config.get('SECRET_KEY', 'default-secret-key')

        if not isinstance(secret_key, str):
            secret_key = str(secret_key)

        token = jwt.encode(
            payload,
            secret_key,
            algorithm='HS256'
        )

        if isinstance(token, bytes):
            token = token.decode('utf-8')

        return token

    @staticmethod
    def decode_token(token):
        try:
            secret_key = current_app.config.get('SECRET_KEY', 'default-secret-key')

            if not isinstance(secret_key, str):
                secret_key = str(secret_key)

            payload = jwt.decode(
                token,
                secret_key,
                algorithms=['HS256']
            )

            if 'exp' in payload and datetime.utcnow().timestamp() > payload['exp']:
                raise Exception('Token has expired')

            return payload
        except jwt.PyJWTError as e:
            raise Exception(f'Invalid token: {str(e)}')

    @staticmethod
    def authenticate(username, password):
        user = User.query.filter_by(username=username).first()
        if user and user.check_password(password):
            user.last_login = datetime.utcnow()
            db.session.commit()
            return user
        return None

    @staticmethod
    def refresh_token(token):
        payload = AuthService.decode_token(token)
        return AuthService.generate_token(payload['sub'])
