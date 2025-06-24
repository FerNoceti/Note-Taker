from functools import wraps
from flask import request, jsonify
from ..services.auth_service import AuthService


def auth_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({"error": "Authorization required"}), 401

        try:
            if token.startswith('Bearer '):
                token = token.split()[1]

            payload = AuthService.decode_token(token)

            kwargs['user_id'] = payload['sub']

            return f(*args, **kwargs)
        except Exception as e:
            print(f"Token validation error: {str(e)}")
            return jsonify({"error": str(e)}), 401

    return decorated
