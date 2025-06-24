from flask import Blueprint

from app.controllers.health_controller import health_bp
from app.controllers.auth_controller import auth_bp
from app.controllers.note_controller import note_bp
from app.controllers.category_controller import category_bp

bp = Blueprint('api', __name__)

bp.register_blueprint(health_bp)
bp.register_blueprint(auth_bp)
bp.register_blueprint(note_bp)
bp.register_blueprint(category_bp)
