from app import db
from sqlalchemy.exc import SQLAlchemyError


class BaseRepository:
    def __init__(self, model):
        self.model = model
        self.session = db.session

    def create(self, **kwargs):
        try:
            instance = self.model(**kwargs)
            db.session.add(instance)
            db.session.commit()
            return instance
        except SQLAlchemyError as e:
            db.session.rollback()
            raise e

    def update(self, id, **kwargs):
        try:
            instance = self.model.query.get(id)
            if not instance:
                return None
            for key, value in kwargs.items():
                setattr(instance, key, value)
            db.session.commit()
            return instance
        except SQLAlchemyError as e:
            db.session.rollback()
            raise e

    def delete(self, id):
        try:
            instance = self.model.query.get(id)
            if not instance:
                return False
            db.session.delete(instance)
            db.session.commit()
            return True
        except SQLAlchemyError as e:
            db.session.rollback()
            raise e

    def find_by_id(self, id):
        return self.model.query.get(id)

    def find_all(self):
        return self.model.query.all()
