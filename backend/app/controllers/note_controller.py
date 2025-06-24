from flask import Blueprint, request, jsonify
from ..services.note_service import NoteService
from ..decorators.security_decorator import auth_required

note_bp = Blueprint('note', __name__)
note_service = NoteService()

@note_bp.route('/notes', methods=['GET'])
@auth_required
def get_notes(user_id):
    try:
        notes = note_service.get_all_notes(user_id)
        return jsonify([note.to_dict(include_categories=True) for note in notes]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@note_bp.route('/notes/active', methods=['GET'])
@auth_required
def get_active_notes(user_id):
    try:
        notes = note_service.get_active_notes(user_id)
        return jsonify([note.to_dict(include_categories=True) for note in notes]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@note_bp.route('/notes/archived', methods=['GET'])
@auth_required
def get_archived_notes(user_id):
    try:
        notes = note_service.get_archived_notes(user_id)
        return jsonify([note.to_dict(include_categories=True) for note in notes]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@note_bp.route('/notes/<int:note_id>', methods=['GET'])
@auth_required
def get_note(user_id, note_id):
    try:
        note = note_service.repository.find_by_id(note_id)
        if not note or note.user_id != user_id:
            return jsonify({"error": "Note not found"}), 404
            
        return jsonify(note.to_dict(include_user=True, include_categories=True)), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@note_bp.route('/notes', methods=['POST'])
@auth_required
def create_note(user_id):
    data = request.get_json()
    if not data or 'title' not in data:
        return jsonify({"error": "Title is required"}), 400

    try:
        category_ids = data.get('category_ids', [])
        note = note_service.create(
            user_id=user_id,
            title=data['title'],
            content=data.get('content'),
            category_ids=category_ids
        )
        return jsonify(note.to_dict(include_user=True, include_categories=True)), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@note_bp.route('/notes/<int:note_id>', methods=['PUT'])
@auth_required
def update_note(user_id, note_id):
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    try:
        update_data = {
            'title': data.get('title'),
            'content': data.get('content'),
            'archived': data.get('archived'),
            'category_ids': data.get('category_ids')
        }
        
        update_data = {k: v for k, v in update_data.items() if v is not None}
        
        note = note_service.update(note_id, **update_data)
        return jsonify(note.to_dict(include_categories=True)), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@note_bp.route('/notes/<int:note_id>', methods=['DELETE'])
@auth_required
def delete_note(user_id, note_id):
    try:
        note_service.delete(note_id)
        return jsonify({"message": "Note deleted successfully"}), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@note_bp.route('/notes/<int:note_id>/archive', methods=['PATCH'])
@auth_required
def archive_note(user_id, note_id):
    try:
        note = note_service.archive_note(note_id)
        return jsonify(note.to_dict(include_categories=True)), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@note_bp.route('/notes/<int:note_id>/unarchive', methods=['PATCH'])
@auth_required
def unarchive_note(user_id, note_id):
    try:
        note = note_service.unarchive_note(note_id)
        return jsonify(note.to_dict(include_categories=True)), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400
