from .base_repository import BaseRepository
from ..models.note_model import Note
from app import db

class NoteRepository(BaseRepository):
    def __init__(self):
        super().__init__(Note)

    def find_by_user_id(self, user_id):
        return self.model.query.filter_by(user_id=user_id).all()

    def find_archived_notes(self, user_id):
        return self.model.query.filter_by(user_id=user_id, archived=True).all()

    def find_active_notes(self, user_id):
        return self.model.query.filter_by(user_id=user_id, archived=False).all()

    def create(self, **kwargs):
        note = self.model(**kwargs)
        db.session.add(note)
        db.session.commit()
        return note

    def update(self, note_id, **kwargs):
        note = self.find_by_id(note_id)
        if not note:
            return None
            
        for key, value in kwargs.items():
            if hasattr(note, key):
                setattr(note, key, value)
                
        db.session.commit()
        return note

    def delete(self, note_id):
        note = self.find_by_id(note_id)
        if note:
            db.session.delete(note)
            db.session.commit()
        return note
