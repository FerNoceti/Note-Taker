from flask import Blueprint, request, jsonify
from ..services.category_service import CategoryService
from ..decorators.security_decorator import auth_required

category_bp = Blueprint('category', __name__)
category_service = CategoryService()

@category_bp.route('/categories', methods=['GET'])
@auth_required
def get_categories(user_id):
    try:
        categories = category_service.get_by_user_id(user_id)
        return jsonify([category.to_dict() for category in categories]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@category_bp.route('/categories', methods=['POST'])
@auth_required
def create_category(user_id):
    data = request.get_json()
    if not data or 'name' not in data:
        return jsonify({"error": "Name is required"}), 400

    try:
        category = category_service.create(user_id, data['name'])
        return jsonify(category.to_dict()), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

@category_bp.route('/categories/<int:category_id>', methods=['PUT'])
@auth_required
def update_category(user_id, category_id):
    data = request.get_json()
    if not data or 'name' not in data:
        return jsonify({"error": "Name is required"}), 400

    try:
        category = category_service.update(category_id, name=data['name'])
        return jsonify(category.to_dict()), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404

@category_bp.route('/categories/<int:category_id>', methods=['DELETE'])
@auth_required
def delete_category(user_id, category_id):
    try:
        category_service.delete(category_id)
        return jsonify({"message": "Category deleted successfully"}), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
