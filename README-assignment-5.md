# Assignment 5

1. Checkout the commit with tag name `assignment-5` (its commit SHA should be `23c5fd2d8926797ad21754b8c61bc5206b0e0883`)

2. Unzip the `Assignment5-secrets.zip` file.

3. Move the unzipped files to the correct locations:
   - `./secrets/auth_service_mongo_uri.txt`
   - `./secrets/auth_service_session_secret.txt`
   - `./secrets/question_service_mongo_uri.txt`
   - `./secrets/user_service_username.txt`
   - `./secrets/user_service_password.txt`
   - `./secrets/user_service_host.txt`

4. Ensure that the Docker daemon is running. The easiest way to do this is to launch the Docker Desktop application.

5. Ensure that Docker `swarm` mode is enabled (this is required to use Docker secrets). To enable Docker `swarm` mode, run the following command in a terminal:

   ```shell
   docker swarm init
   ```

6. To build the Docker images (using the Docker compose file) and run the Docker containers, open a terminal in the root directory of the project and run the following command:

   ```shell
   # To build the images and run the containers
   docker-compose up --build

   # To build the images and run the containers in the background
   docker-compose up --build -d
   ```

7. Just like assignment 3, we have a basic user with username `john` and password `password`, and an admin / maintainer user with username `mary` and password `mary`.

8. To stop all the Dockers containers, either press `Ctrl + C` or run the following command:

   ```shell
   docker-compose down
   ```
