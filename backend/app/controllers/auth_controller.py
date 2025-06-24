from flask import Blueprint, request, jsonify, current_app
import jwt
from datetime import datetime, timedelta
from ..services.auth_service import AuthService
from ..services.user_service import UserService
from ..decorators.security_decorator import auth_required

auth_bp = Blueprint('auth', __name__)
user_service = UserService()
auth_service = AuthService()


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({"error": "Username and password are required"}), 400

    try:
        user = user_service.create(
            username=data['username'],
            password=data['password']
        )
        return jsonify(user.to_dict()), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({"error": "Username and password are required"}), 400

    user = AuthService.authenticate(data['username'], data['password'])
    if user:
        token = AuthService.generate_token(str(user.id))
        return jsonify({
            'token': token,
            'user': user.to_dict()
        }), 200
    return jsonify({"error": "Invalid credentials"}), 401


@auth_bp.route('/protected')
@auth_required
def protected():
    return jsonify({"message": "Protected route"})


@auth_bp.route('/refresh-token', methods=['POST'])
def refresh_token():
    data = request.get_json()
    token = data.get('token')

    if not token:
        return jsonify({'error': 'Token is required'}), 400

    try:
        payload = jwt.decode(
            token,
            current_app.config['SECRET_KEY'],
            algorithms=['HS256'],
            options={"verify_exp": False}
        )

        user_id = payload.get('sub')
        if not user_id:
            return jsonify({'error': 'Invalid token: missing user ID'}), 401

        new_token = AuthService.generate_token(user_id)
        return jsonify({'newToken': new_token}), 200

    except jwt.InvalidTokenError as e:
        return jsonify({'error': f'Invalid token: {str(e)}'}), 401
    except Exception as e:
        return jsonify({'error': f'Internal error: {str(e)}'}), 500
