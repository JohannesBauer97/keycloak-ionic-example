export const environment = {
  production: true,
  keycloak: {
    web: {
      issuer: 'http://localhost:8080',
      redirectUri: 'http://localhost:8100',
      clientId: 'toks-web',
      revocationEndpoint: 'http://localhost:8080'
    },
    ios: {
      issuer: 'http://192.168.64.1:8080',
      redirectUri: 'myschema://login',
      clientId: 'toks-web',
      revocationEndpoint: 'http://192.168.64.1:8080'
    }
  }
};
