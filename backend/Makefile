# Only to be used in development environment

apps := django_axor_auth items

.PHONY: all

venv:
	rm -rf .venv
	python3 -m venv .venv
	.venv/bin/python -m pip install -r requirements.txt

setupdb:
	find . -type d -name migrations -prune -not -path "./.venv/*" -exec rm -rf {} \;
	.venv/bin/python manage.py makemigrations $(apps)
	.venv/bin/python manage.py migrate
	.venv/bin/python manage.py migrate --database=errorlogger

superuser:
	.venv/bin/python manage.py createsuperuser

getready: venv setupdb

run:
	.venv/bin/python manage.py runserver 0.0.0.0:8000

su:
	.venv/bin/python manage.py createsuperuser

# Install all the dependencies directly in the system
# This is not recommended, but it is useful for docker images
pipinstallsystem:
	python3 -m pip install -r requirements.txt

# Make docker image
# Usage: make dockerimage tag=tagname:version
dockerimage:
	docker build --progress=plain . -t ${tag}

# Run docker image
# Usage: make dockerrun tag=tagname:version port=port name=containername
dockerrun:
	docker run -d -p ${port}:8000 --name ${name} -t ${tag}
