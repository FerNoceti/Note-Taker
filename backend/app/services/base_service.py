from sqlalchemy.exc import SQLAlchemyError


class BaseService:
    def __init__(self, repository):
        self.repository = repository

    def create(self, **kwargs):
        try:
            return self.repository.create(**kwargs)
        except SQLAlchemyError as e:
            raise Exception(f"Error creating: {str(e)}")

    def update(self, id, **kwargs):
        try:
            return self.repository.update(id, **kwargs)
        except SQLAlchemyError as e:
            raise Exception(f"Error updating: {str(e)}")

    def delete(self, id):
        try:
            return self.repository.delete(id)
        except SQLAlchemyError as e:
            raise Exception(f"Error deleting: {str(e)}")

    def get_by_id(self, id):
        try:
            return self.repository.find_by_id(id)
        except SQLAlchemyError as e:
            raise Exception(f"Error retrieving by ID: {str(e)}")

    def get_all(self):
        try:
            return self.repository.find_all()
        except SQLAlchemyError as e:
            raise Exception(f"Error retrieving all: {str(e)}")
