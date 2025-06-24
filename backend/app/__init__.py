from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import inspect, text
from .configurations.db_config import DBConfig

db = SQLAlchemy()

def init_db(app):
    """Initialize the database with required schemas and tables"""
    with app.app_context():
        inspector = inspect(db.engine)
        
        with db.engine.connect() as conn:
            # Create auth schema if it doesn't exist
            conn.execute(text("CREATE SCHEMA IF NOT EXISTS auth;"))
            conn.commit()
            
            # Check and create tables
            tables_to_check = [
                ('users', 'auth', """
                    CREATE TABLE auth.users (
                        id SERIAL PRIMARY KEY,
                        username VARCHAR(80) UNIQUE NOT NULL,
                        password_hash VARCHAR(255) NOT NULL,
                        active BOOLEAN DEFAULT TRUE,
                        last_login TIMESTAMP NULL
                    );
                """),
                ('notes', 'public', """
                    CREATE TABLE public.notes (
                        id SERIAL PRIMARY KEY,
                        user_id INTEGER NOT NULL,
                        title VARCHAR(255) NOT NULL,
                        content TEXT,
                        archived BOOLEAN DEFAULT FALSE,
                        created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                        CONSTRAINT fk_user
                            FOREIGN KEY (user_id)
                            REFERENCES auth.users(id)
                            ON DELETE CASCADE
                    );
                """),
                ('categories', 'public', """
                    CREATE TABLE public.categories (
                        id SERIAL PRIMARY KEY,
                        user_id INTEGER NOT NULL,
                        name VARCHAR(100) NOT NULL,
                        created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                        CONSTRAINT fk_user_categories
                            FOREIGN KEY (user_id)
                            REFERENCES auth.users(id)
                            ON DELETE CASCADE
                    );
                """),
                ('note_categories', 'public', """
                    CREATE TABLE public.note_categories (
                        note_id INTEGER NOT NULL,
                        category_id INTEGER NOT NULL,
                        PRIMARY KEY (note_id, category_id),
                        CONSTRAINT fk_note
                            FOREIGN KEY (note_id)
                            REFERENCES public.notes(id)
                            ON DELETE CASCADE,
                        CONSTRAINT fk_category
                            FOREIGN KEY (category_id)
                            REFERENCES public.categories(id)
                            ON DELETE CASCADE
                    );
                """)
            ]
            
            for table_name, schema, create_sql in tables_to_check:
                if not inspector.has_table(table_name, schema=schema):
                    conn.execute(text(create_sql))
                    conn.commit()
            
            # Create functions
            functions = [
                ("update_updated_at_column", """
                    CREATE OR REPLACE FUNCTION update_updated_at_column()
                    RETURNS TRIGGER AS $$
                    BEGIN
                       NEW.updated_at = NOW();
                       RETURN NEW;
                    END;
                    $$ LANGUAGE plpgsql;
                """),
                ("update_categories_updated_at", """
                    CREATE OR REPLACE FUNCTION update_categories_updated_at()
                    RETURNS TRIGGER AS $$
                    BEGIN
                       NEW.updated_at = NOW();
                       RETURN NEW;
                    END;
                    $$ LANGUAGE plpgsql;
                """)
            ]
            
            for func_name, create_sql in functions:
                result = conn.execute(text(
                    "SELECT 1 FROM pg_proc WHERE proname = :func_name"
                ), {'func_name': func_name}).fetchone()
                if not result:
                    conn.execute(text(create_sql))
                    conn.commit()
            
            # Create triggers
            triggers = [
                ("set_updated_at", "public.notes", """
                    CREATE TRIGGER set_updated_at
                    BEFORE UPDATE ON public.notes
                    FOR EACH ROW
                    EXECUTE FUNCTION update_updated_at_column();
                """),
                ("set_categories_updated_at", "public.categories", """
                    CREATE TRIGGER set_categories_updated_at
                    BEFORE UPDATE ON public.categories
                    FOR EACH ROW
                    EXECUTE FUNCTION update_categories_updated_at();
                """)
            ]
            
            for trigger_name, table_name, create_sql in triggers:
                result = conn.execute(text(
                    "SELECT 1 FROM pg_trigger WHERE tgname = :trigger_name"
                ), {'trigger_name': trigger_name}).fetchone()
                if not result:
                    conn.execute(text(create_sql))
                    conn.commit()

def create_app():
    app = Flask(__name__)
    app.config.from_object(DBConfig)
    db.init_app(app)
    
    CORS(app)
    
    with app.app_context():
        init_db(app)
    
    from api import bp as api_bp
    app.register_blueprint(api_bp, url_prefix="/api")
    
    return app
