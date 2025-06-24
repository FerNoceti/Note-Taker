from flask import Blueprint, jsonify

from ..services.health_service import calculate_uptime, check_db_connection

health_bp = Blueprint('health', __name__)


@health_bp.route('/healthcheck', methods=['GET'])
def health_check():
    try:
        uptime_str = calculate_uptime()
        db_status = check_db_connection()

        health_status = {
            "status": "Service is up and running",
            "uptime": uptime_str,
            "database": "Connected" if db_status else "Connection failed"
        }

        return jsonify(health_status), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
