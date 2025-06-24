# JOSENOCETI - Challenge App

This project is a full-stack web application designed for managing notes and categories. It allows users to register, log in, create, organize, and manage their notes, assigning them to different categories.

## Project Structure

The project is divided into two main components:

-   **`backend/`**: The RESTful API developed with Flask (Python) that handles business logic, user authentication, and data persistence (notes and categories).
-   **`frontend/`**: The user interface developed with React (JavaScript) that consumes the backend API to provide an interactive user experience.

## Technologies Used

### Backend

-   **Python**: Main programming language.
-   **Flask**: Web microframework for API development.
-   **Flask-SQLAlchemy**: ORM for interacting with the database.
-   **PostgreSQL**: Relational database (configured via Docker).
-   **Flask-CORS**: For handling Cross-Origin Resource Sharing policies.
-   **Docker**: For containerization of the application and database.

### Frontend

-   **React**: JavaScript library for building user interfaces.
-   **Axios**: HTTP client for making requests to the backend API.
-   **React Router DOM**: For single-page application (SPA) navigation.
-   **Material-UI (MUI)**: UI component library for a modern and responsive design.

## How to Initialize the Project

To get the project up and running, make sure you have [Docker](https://www.docker.com/get-started/) and [Docker Compose](https://docs.docker.com/compose/install/) installed on your system.

1.  **Clone the Repository**

    If you haven't already, clone the project repository:

    ```bash
    git clone <REPOSITORY_URL>
    cd JOSENOCETI-a22658
    ```

2.  **Environment Variable Configuration (Optional but Recommended)**

    Although Docker Compose handles much of the configuration, you might need to set specific environment variables for the backend (e.g., `DATABASE_URL`, `SECRET_KEY`). You can do this by creating a `.env` file in the `backend/` directory if necessary, following the structure of a potential `.env.example` file.

3.  **Start Docker Containers**

    From the project root, run the following command to build and bring up the services defined in `docker-compose.yml`:

    ```bash
    docker-compose up --build -d
    ```

    -   `--build`: Rebuilds Docker images (useful if you've made changes to the `Dockerfile` or `requirements.txt`).
    -   `-d`: Runs containers in "detached" mode (in the background).

    This command will:
    -   Build the backend image (based on `backend/Dockerfile`).
    -   Build the frontend image (based on `frontend/Dockerfile`).
    -   Bring up a PostgreSQL container.
    -   Bring up the backend service (API).
    -   Bring up the frontend service (Nginx server serving the React application).

4.  **Access the Application**

    Once the containers are running (it may take a few minutes the first time):

    -   **Frontend**: Should be accessible in your browser at `http://localhost:3000` (or the port configured in `nginx.conf` and `docker-compose.yml`).
    -   **Backend API**: The API will be available internally within the Docker container, and exposed at `http://localhost:5000` (or the port configured in `docker-compose.yml`). For example, the healthcheck endpoint is `http://localhost:5000/api/healthcheck`.

5.  **Stop Containers**

    To stop and remove the containers, networks, and volumes created by `docker-compose up`, run:

    ```bash
    docker-compose down
    ```

    If you only want to stop the containers without removing them, use:

    ```bash
    docker-compose stop
    ```

## Using the Application

Once the application is running, you will be able to:

-   **Register** as a new user.
-   **Log in** with your credentials.
-   **Create new notes** and assign them a title and content.
-   **Create categories** to organize your notes.
-   **Assign notes to categories**.
-   **Edit and delete** existing notes and categories.
-   **Archive and unarchive** notes.

Enjoy the application!
