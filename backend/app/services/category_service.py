from ..models.category_model import Category
from .base_service import BaseService
from ..repositories.category_repository import CategoryRepository

class CategoryService(BaseService):
    def __init__(self):
        super().__init__(CategoryRepository())

    def create(self, user_id, name):
        existing = self.repository.find_by_name(user_id, name)
        if existing:
            raise ValueError("Category name already exists")
        return self.repository.create(user_id=user_id, name=name)

    def update(self, category_id, **kwargs):
        valid_attrs = ['name']
        update_data = {k: v for k, v in kwargs.items() if k in valid_attrs}
        
        category = self.repository.update(category_id, **update_data)
        if not category:
            raise ValueError("Category not found")
        return category

    def delete(self, category_id):
        category = self.repository.delete(category_id)
        if not category:
            raise ValueError("Category not found")
        return category
    
    def get_by_user_id(self, user_id):
        return self.repository.find_by_user_id(user_id)
