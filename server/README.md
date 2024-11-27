# Server

## Database 

`server/database/` directory contains a SQLite database implementation.

```
server/database/
├── schema.sql     # Database table definitions
├── db_setup.py    # Script for db creation
├── imports.sql    # Initial seed data
└── baza.db        # Generated SQLite database (after setup)
```



### Files Description

- `schema.sql`: Drops tables and then creates new. Defines all database tables and their relationships. 


- `imports.sql`: Contains initial seed data for testing/development.

- `db_setup.py`: Script that deletes old baza.db, creates new, runs schema on it and then initializes with seed data from `imports.sql`.


### Database Setup

1. Ensure you have Python 3.x installed
2. When in server directory run the setup script:
```bash
python3 database/setup_db.py
```

This will create a fresh `baza.db` file with all tables and initial data.