import store from '@/redux/store';
import Routes from '@/routes/Routers';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Provider } from 'react-redux';
const queryClient = new QueryClient();
export default function App() {
  return (
      
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>

      <Routes/>

      </QueryClientProvider>

    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
