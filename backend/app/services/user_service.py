from ..models.user_model import User
from .base_service import BaseService
from ..repositories.user_repository import UserRepository
from app import db


class UserService(BaseService):
    def __init__(self):
        super().__init__(UserRepository())

    def create(self, username, password):
        if User.query.filter_by(username=username).first():
            raise Exception("Username already exists")

        new_user = User(username=username)
        new_user.set_password(password)

        db.session.add(new_user)
        db.session.commit()
        return new_user
