# Keycloak Ionic (Capacitor) Example
Showing how to connect your Ionic app with a Keycloak instance.

# Initial Project Setup
## Requirements
* [NodeJS & NPM](https://nodejs.org/en/)
* [Docker](https://www.docker.com/)

## Install Ionic
[Official Documentation](https://ionicframework.com/)
```shellsession
npm i -g @ionic/cli
```

## Create empty project
[Official Documentation](https://ionicframework.com/docs/cli/commands/start)
```shellsession
ionic start example blank
```

## Start local Keycloak instance using Docker
[Official Documentation](https://www.keycloak.org/getting-started/getting-started-docker)
````shellsession
docker run -p 8080:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:20.0.1 start-dev
````
This will start Keycloak exposed on the local port `8080`. It will also create an initial admin user with username `admin` and password `admin`.
