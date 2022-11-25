import { Component, OnInit } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{
  public userProfile: any;
  public hasValidAccessToken = false;
  public realmRoles: string[] = [];

  private authConfig: AuthConfig = {
    issuer: "http://localhost:8080/realms/master",
    redirectUri: "http://localhost:8100",
    clientId: 'example-ionic-app',
    responseType: 'code',
    scope: 'openid profile email offline_access',
    // Revocation Endpoint must be set manually when using Keycloak
    // See: https://github.com/manfredsteyer/angular-oauth2-oidc/issues/794
    revocationEndpoint: "http://localhost:8080/realms/master/protocol/openid-connect/revoke",
    showDebugInformation: true
  }

  /**
   * Configuring the library
   * @param oauthService
   */
  constructor(private oauthService: OAuthService) {
    this.oauthService.configure(this.authConfig);
    this.oauthService.setupAutomaticSilentRefresh();
  }

  ngOnInit(): void {
    /**
     * Load discovery document when the app inits
     */
    this.oauthService.loadDiscoveryDocument()
      .then(loadDiscoveryDocumentResult => {
        console.log("loadDiscoveryDocument", loadDiscoveryDocumentResult);

        /**
         * Do we have a valid access token? -> User does not need to log in
         */
        this.hasValidAccessToken = this.oauthService.hasValidAccessToken();

        /**
         * Always call tryLogin after the app and discovery document loaded, because we could come back from Keycloak login page.
         * The library needs this as a trigger to parse the query parameters we got from Keycloak.
         */
        this.oauthService.tryLogin().then(tryLoginResult => {
          console.log("tryLogin", tryLoginResult);
          if (this.hasValidAccessToken){
            this.loadUserProfile();
            this.realmRoles = this.getRealmRoles();
          }
        });

      })
      .catch(error => {
        console.error("loadDiscoveryDocument", error);
      });

    /**
     * The library offers a bunch of events.
     * It would be better to filter out the events which are unrelated to access token - trying to keep this example small.
     */
    this.oauthService.events.subscribe(eventResult => {
      console.debug("LibEvent", eventResult);
      this.hasValidAccessToken = this.oauthService.hasValidAccessToken();
    })
  }

  /**
   * Calls the library loadDiscoveryDocumentAndLogin() method.
   */
  public login(): void {
    this.oauthService.loadDiscoveryDocumentAndLogin()
      .then(loadDiscoveryDocumentAndLoginResult => {
        console.log("loadDiscoveryDocumentAndLogin", loadDiscoveryDocumentAndLoginResult);
      })
      .catch(error => {
        console.error("loadDiscoveryDocumentAndLogin", error);
      });
  }

  /**
   * Calls the library revokeTokenAndLogout() method.
   */
  public logout(): void {
    this.oauthService.revokeTokenAndLogout()
      .then(revokeTokenAndLogoutResult => {
        console.log("revokeTokenAndLogout", revokeTokenAndLogoutResult);
      })
      .catch(error => {
        console.error("revokeTokenAndLogout", error);
      });
  }

  /**
   * Calls the library loadUserProfile() method and sets the result in this.userProfile.
   */
  public loadUserProfile(): void {
    this.oauthService.loadUserProfile()
      .then(loadUserProfileResult => {
        console.log("loadUserProfile", loadUserProfileResult);
        this.userProfile = loadUserProfileResult;
      })
      .catch(error => {
        console.error("loadUserProfile", error);
      });
  }

  /**
   *  Use this method only when an id token is available.
   *  This requires a specific mapper setup in Keycloak. (See README file)
   *
   *  Parses realm roles from identity claims.
   */
  public getRealmRoles(): string[] {
    let idClaims = this.oauthService.getIdentityClaims()
    if (!idClaims){
      console.error("Couldn't get identity claims, make sure the user is signed in.")
      return [];
    }
    if (!idClaims.hasOwnProperty("realm_roles")){
      console.error("Keycloak didn't provide realm_roles in the token. Have you configured the predefined mapper realm roles correct?")
      return [];
    }

    let realmRoles = idClaims["realm_roles"]
    return realmRoles ?? [];
  }

}
