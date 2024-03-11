# Master EAD

This is an all-in-one tool for managing data. Some key features include:

-   **Multiple Admins**: You can have multiple admins for your data. This is useful for teams that need to manage data together.
-   **Data Management**: You can manage your data in a variety of ways. This includes adding, editing, and deleting data.
-   **Data Relationships**: You can create relationships between your data. This is useful for creating a network of data.

## Table of Contents

-   [Master EAD](#master-ead)
    -   [Table of Contents](#table-of-contents)
    -   [Getting Started](#getting-started)
        -   [Manual Deployment](#manual-deployment)
        -   [Building with Docker on Linux](#building-with-docker-on-linux)
    -   [Contributing](#contributing)
    -   [License](#license)

## Getting Started

There are two ways to get started with Master EAD. You can either deploy it manually or use the Docker image method.

### Manual Deployment

1. Clone the repository

    ```bash
    git clone https://github.com/gauravjot/ead.git
    ```

2. Set up a virtual environment and activate it.

    ```bash
    cd ./backend
    python3 -m venv venv
    ```

    Linux/MacOS

    ```bash
    source venv/bin/activate
    ```

    Windows

    ```bash
    .\venv\Scripts\activate
    ```

    Install the required packages

    ```bash
    pip install -r requirements.txt
    ```

3. Set environment variables for Django. Rename `sample.env` to `.env` and fill in the required fields.
4. Run database migrations

    ```bash
    python manage.py makemigrations users items admins
    python manage.py migrate
    ```

    If you encounter any issues, please refer to the [Django Documentation](https://docs.djangoproject.com/en/3.2/topics/migrations/).

5. **For Production**: Set up a Django production environment. Follow this guide - [Deploy Django REST APIs on Ubuntu Server with uWSGI](https://gauravjot.com/blog/deploy_django_api_with_uwsgi_on_ubuntu).

    **For Development**: Run the Django server

    ```bash
    python manage.py runserver 0.0.0.0:8000
    ```

6. Go to the `frontend` directory and install the required packages

    ```bash
    npm install
    ```

7. Set environment variables for the frontend. Rename `sample.env` to `.env` and update fields as required.
8. **For Production**: Build the frontend

    ```bash
    npm run build
    ```

    You can then serve the static files using a web server like Nginx.

    **For Development**: Run the frontend server

    ```bash
    npm run dev
    ```

### Building with Docker on Linux

1. Clone the repository.
2. Edit the `deploy/backend.env` and `deploy/frontend.env` files to set the IP address on which the app will be accessible.
3. Run the makefile in root directory.

    ```bash
    make build
    ```

    This will build the docker image for the project and the application will be available through port 80 of the image.

4. Run the docker container.

    ```bash
    make run
    ```

    This will run the container and the application will be available on port 8080 of the host machine. You can change the port in the `Makefile`.

## Contributing

There are several ways you can contribute to this project:

1. Code Contributions: You can help us by writing code, fixing bugs, and implementing new features. Check out the Issues section for tasks that need attention or suggest improvements.

2. Bug Reports: If you encounter a bug while using Letsnote, please report it in the Issues section. Be sure to include relevant details that can help us reproduce the issue.

3. Feature Requests: Have an idea for a new feature? Share it with us in the Issues section. We encourage discussions around potential enhancements to the project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
