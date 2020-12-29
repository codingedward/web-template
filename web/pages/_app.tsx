import React from 'react';
import Router from 'next/router';
import { ApolloProvider } from '@apollo/client';
// import { Provider as ReduxProvider } from 'react-redux';
import NProgress from 'nprogress'; //nprogress module

// import { useStore } from '../lib/redux';
import { useApollo } from '../lib/apollo';
import '../scss/index.scss';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

interface IApp {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pageProps?: any;
  Component: React.ComponentType;
}

function App({ Component, pageProps }: IApp): JSX.Element {
  //const reduxStore = useStore(pageProps.initialReduxState);
  const apolloClient = useApollo(pageProps.initialApolloState);

  return (
    <ApolloProvider client={apolloClient}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default App;
