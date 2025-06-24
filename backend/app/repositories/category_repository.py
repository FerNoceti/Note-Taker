from .base_repository import BaseRepository
from ..models.category_model import Category
from app import db

class CategoryRepository(BaseRepository):
    def __init__(self):
        super().__init__(Category)

    def find_by_user_id(self, user_id):
        return self.model.query.filter_by(user_id=user_id).all()

    def find_by_name(self, user_id, name):
        return self.model.query.filter_by(user_id=user_id, name=name).first()

    def create(self, **kwargs):
        category = self.model(**kwargs)
        db.session.add(category)
        db.session.commit()
        return category

    def update(self, category_id, **kwargs):
        category = self.find_by_id(category_id)
        if not category:
            return None
            
        for key, value in kwargs.items():
            if hasattr(category, key):
                setattr(category, key, value)
                
        db.session.commit()
        return category

    def delete(self, category_id):
        category = self.find_by_id(category_id)
        if category:
            db.session.delete(category)
            db.session.commit()
        return category
