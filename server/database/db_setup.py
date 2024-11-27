import os
import sqlite3

def setup_database():
    # Database path
    db_path = "server/database/baza.db"
    
    # Remove old database if it exists
    if os.path.exists(db_path):
        print(f"Removing existing database at {db_path}")
        os.remove(db_path)
    
    # Create database directory if it doesn't exist
    os.makedirs(os.path.dirname(db_path), exist_ok=True)
    
    # Connect to the new database
    print("Creating new database...")
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Read and execute schema
        print("Applying schema...")
        with open("server/database/schema.sql", 'r', encoding='utf-8') as schema_file:
            cursor.executescript(schema_file.read())
        
        # Read and execute imports
        print("Importing data...")
        with open("server/database/imports.sql", 'r', encoding='utf-8') as imports_file:
            cursor.executescript(imports_file.read())
        
        # Commit changes
        conn.commit()
        print("Database setup completed successfully!")
        
    except sqlite3.Error as e:
        print(f"An error occurred: {e}")
        conn.rollback()
    except FileNotFoundError as e:
        print(f"Could not find required file: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    setup_database()