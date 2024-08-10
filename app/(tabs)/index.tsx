import React, { useEffect, useState } from 'react';
import { Button, Text, View, StyleSheet } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import { useAuth0, Auth0Provider } from 'react-native-auth0';

const auth0Domain = "dev-1dw48zoypo63ji15.us.auth0.com";
const auth0ClientId = "hVrPKLIB3tIouhyv7XWkCy2rZkCl9TCR";

// Main component for the home screen
const Home = () => {
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: auth0ClientId,
      redirectUri: AuthSession.makeRedirectUri({
        scheme: "myapp",
      }),
      scopes: ["openid", "profile", "email"],
      extraParams: {
        audience: `https://${auth0Domain}/userinfo`,
      },
    },
    { authorizationEndpoint: `https://${auth0Domain}/authorize` }
  );

  const { clearSession, user, error, isLoading } = useAuth0();
  const [authCode, setAuthCode] = useState(null);

  useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;
      setAuthCode(code);
      // Here you can handle the access token and perform authentication
    }
  }, [response]);

  // Function to handle logout
  const onLogout = async () => {
    try {
      // Calls the clearSession function to log out
      await clearSession();
    } catch (e) {
      // Handles any error that occurs during logout
      console.log('Log out cancelled');
    }
  };

  // Renders the user interface
  return (
    <View style={styles.container}>
      {/* Displays a login button */}
      <Button
        disabled={!request}
        title="Login with Auth0"
        onPress={() => {
          promptAsync();
        }}
      />
      {/* Displays a welcome message if the user is authenticated */}
      {user && <Text>Welcome, {user.name}!</Text>}
      {/* Displays a logout button if the user is authenticated */}
      {user && <Button title="Log out" onPress={onLogout} />}
      {/* Displays a loading message if authentication is in progress */}
      {isLoading && <Text>Loading...</Text>}
      {/* Displays an error message if any error occurs during authentication */}
      {error && <Text>Error: {error.message}</Text>}
    </View>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});

// Main application component
const App = () => {
  return (
    <Auth0Provider domain={auth0Domain} clientId={auth0ClientId}>
      <Home />
    </Auth0Provider>
  );
};

export default App;