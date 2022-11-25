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

## Keycloak configuration
This example uses the default `master` realm and `admin` user.
Follow these instructions careful or import the json file at the end to have the same settings.

### Create the example client
1. Create the client with id `example-ionic-app` on `master` realm (default settings in Keycloak 20)
2. Add `http://localhost:8100` to Valid redirect URIs, Valid post logout redirect URIs and Web origins
3. Add the predefined token mapper "realm roles" to the client. Navigate to clients -> open example-ionic-app -> open tab client scopes -> open example-ionic-app-dedicated -> add predefined mapper -> search & add "realm roles" mapper -> open realm roles mapper -> edit token claim name from "realm_access.roles" to "realm_roles" -> save

__Why do we need the token mapper?__
When you get a JWT access/id token from Keycloak with the default settings, and inspect the token with [jwt.io](https://jwt.io/) you'll see that realm roles are actually already part of the token. But every provider (Keycloak, IdentityServer, Auth0,...) might use a different naming for the fields where the roles are listed. This cannot be handled by a generic OAuth library. But we can configure Keycloak to add the list of realm roles to any token claim we want. And this is what we've done. After adding the token mapper, a new claim "realm_roles" is added which contains a list of the assigned user roles. If you're working with client roles, you can add the predefined mapper "client roles". Make sure that you use no dots in the token claim name, this cannot be handled by the generic OAuth library.

*Exported example-ionic-app client*
```json
{
  "clientId": "example-ionic-app",
  "name": "example-ionic-app",
  "description": "",
  "rootUrl": "",
  "adminUrl": "",
  "baseUrl": "",
  "surrogateAuthRequired": false,
  "enabled": true,
  "alwaysDisplayInConsole": false,
  "clientAuthenticatorType": "client-secret",
  "redirectUris": [
    "http://localhost:8100"
  ],
  "webOrigins": [
    "http://localhost:8100"
  ],
  "notBefore": 0,
  "bearerOnly": false,
  "consentRequired": false,
  "standardFlowEnabled": true,
  "implicitFlowEnabled": false,
  "directAccessGrantsEnabled": true,
  "serviceAccountsEnabled": false,
  "publicClient": true,
  "frontchannelLogout": true,
  "protocol": "openid-connect",
  "attributes": {
    "oidc.ciba.grant.enabled": "false",
    "backchannel.logout.session.required": "true",
    "post.logout.redirect.uris": "http://localhost:8100",
    "oauth2.device.authorization.grant.enabled": "false",
    "display.on.consent.screen": "false",
    "backchannel.logout.revoke.offline.tokens": "false"
  },
  "authenticationFlowBindingOverrides": {},
  "fullScopeAllowed": true,
  "nodeReRegistrationTimeout": -1,
  "protocolMappers": [
    {
      "name": "realm roles",
      "protocol": "openid-connect",
      "protocolMapper": "oidc-usermodel-realm-role-mapper",
      "consentRequired": false,
      "config": {
        "multivalued": "true",
        "userinfo.token.claim": "true",
        "id.token.claim": "true",
        "access.token.claim": "true",
        "claim.name": "realm_roles",
        "jsonType.label": "String"
      }
    }
  ],
  "defaultClientScopes": [
    "web-origins",
    "acr",
    "roles",
    "profile",
    "email"
  ],
  "optionalClientScopes": [
    "address",
    "phone",
    "offline_access",
    "microprofile-jwt"
  ],
  "access": {
    "view": true,
    "configure": true,
    "manage": true
  }
}
```
## Install angular-oauth2-oidc library
* NPMJS: https://www.npmjs.com/package/angular-oauth2-oidc
* Sources and Sample: https://github.com/manfredsteyer/angular-oauth2-oidc
* Source Code Documentation: https://manfredsteyer.github.io/angular-oauth2-oidc/docs
* Community-provided sample implementation: https://github.com/jeroenheijmans/sample-angular-oauth2-oidc-with-auth-guards/

```shellsession
npm i angular-oauth2-oidc --save
```
## Remove the home module
You can see in the example code, that there is no home module. To keep the example simple and small, everything is implemented in the app module/component.

# Connecting Keycloak with Ionic
## Setup app.module.ts
1. Add `HttpClientModule` to imports
2. Add `OAuthModule.forRoot()` to imports
