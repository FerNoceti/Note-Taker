from datetime import datetime
from app import db


note_categories = db.Table('note_categories',
    db.Column('note_id', db.Integer, db.ForeignKey('public.notes.id', ondelete='CASCADE'), primary_key=True),
    db.Column('category_id', db.Integer, db.ForeignKey('public.categories.id', ondelete='CASCADE'), primary_key=True),
    schema='public'
)

class Note(db.Model):
    __tablename__ = 'notes'
    __table_args__ = {'schema': 'public'}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('auth.users.id', ondelete='CASCADE'), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text, nullable=True)
    archived = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = db.relationship('User', backref='notes', lazy='joined', foreign_keys=[user_id])
    categories = db.relationship('Category', 
                               secondary=note_categories,
                               backref='notes',
                               lazy='dynamic',
                               cascade='all, delete')

    def to_dict(self, include_user=False, include_categories=False):
        data = {
            'id': self.id,
            'user_id': self.user_id,
            'title': self.title,
            'content': self.content,
            'archived': self.archived,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
        if include_user and hasattr(self, 'user') and self.user:
            data['user'] = self.user.to_dict()
        if include_categories:
            data['categories'] = [category.to_dict() for category in self.categories]
        return data
