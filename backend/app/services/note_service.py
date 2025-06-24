from ..models.note_model import Note
from .base_service import BaseService
from ..repositories.note_repository import NoteRepository
from app import db

class NoteService(BaseService):
    def __init__(self):
        super().__init__(NoteRepository())

    def create(self, user_id, title, content=None, category_ids=None):
        note = self.repository.create(
            user_id=user_id,
            title=title,
            content=content
        )
        
        if category_ids:
            self.update_note_categories(note, category_ids)
            
        return note

    def update(self, note_id, **kwargs):
        valid_attrs = ['title', 'content', 'archived', 'category_ids']
        update_data = {k: v for k, v in kwargs.items() if k in valid_attrs}
        
        note = self.repository.update(note_id, **update_data)
        if not note:
            raise ValueError("Note not found")
            
        if 'category_ids' in update_data:
            self.update_note_categories(note, update_data['category_ids'])
            
        return note

    def update_note_categories(self, note, category_ids):
        from ..models.category_model import Category
        
        note.categories = []
        
        for cat_id in category_ids:
            category = Category.query.get(cat_id)
            if category and category.user_id == note.user_id:
                note.categories.append(category)
                
        db.session.commit()

    def delete(self, note_id):
        note = self.repository.delete(note_id)
        if not note:
            raise ValueError("Note not found")
        return note
    
    def get_by_user_id(self, user_id):
        return self.repository.find_by_user_id(user_id)
    
    def get_archived_notes(self, user_id):
        return self.repository.find_archived_notes(user_id)
    
    def get_active_notes(self, user_id):
        return self.repository.find_active_notes(user_id)

    def archive_note(self, note_id):
        return self.repository.update(note_id, archived=True)
    
    def unarchive_note(self, note_id):
        return self.repository.update(note_id, archived=False)
    
    def get_all_notes(self, user_id):
        return self.repository.find_by_user_id(user_id)
