#!/bin/sh

# Wait for the database to be ready
echo "Waiting for PostgreSQL to start..."
while ! pg_isready -h $DATABASE_HOST -p $DATABASE_PORT -U $DATABASE_USERNAME; do
  sleep 1
done
echo "PostgreSQL started."

# Apply migrations
echo "Applying database migrations..."
python manage.py makemigrations 
python manage.py migrate --noinput

echo "Creating initial users..."
# Create Superuser (admin)
python manage.py setup_users

# Load fixtures
echo "Loading boilerplate data fixtures..."
python manage.py loaddata fixtures/users_data.json
python manage.py loaddata fixtures/publishers_data.json
python manage.py loaddata fixtures/raports_data.json

# Start the application server
echo "Starting Django server..."
exec "$@"