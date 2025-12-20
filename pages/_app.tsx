import React, { Fragment, useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import Router from 'next/router';
import Head from 'next/head';
import { TOKEN } from '../services/auth';
import '@/styles/globals.css';
import 'semantic-ui-css/semantic.min.css';
import 'react-vertical-timeline-component/style.min.css';
import '../public/css/timeline.css';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import Show from '../components/show';
import LoaderPage from '../components/loaderPage';
import LoadingGlobal from '../components/loadingGlobal';
import Cookies from 'js-cookie';
import { store } from '../store';
import { useGetAppInfoQuery } from '../store/api/authApi';

const ASSET_PREFIX_RAW = process.env.NEXT_PUBLIC_ASSET_PREFIX || '';
const ASSET_PREFIX = ASSET_PREFIX_RAW ? (ASSET_PREFIX_RAW.endsWith('/') ? ASSET_PREFIX_RAW : ASSET_PREFIX_RAW + '/') : '';
const APP_THEME = process.env.NEXT_PUBLIC_APP_THEME || 'default';

Router.events.on('routeChangeStart', () => {
  const loadingBrand = document.getElementById('loading-brand');
  if (loadingBrand) loadingBrand.style.display = 'block';
});

Router.events.on('routeChangeComplete', () => {
  const loadingBrand = document.getElementById('loading-brand');
  if (loadingBrand) loadingBrand.style.display = 'none';
});

Router.events.on('routeChangeError', () => {
  const loadingBrand = document.getElementById('loading-brand');
  if (loadingBrand) loadingBrand.style.display = 'none';
});

interface AppData {
  name?: string;
  icon?: string;
  [key: string]: any;
}

const AppContent = ({ Component, pageProps }: any) => {
  const [loading, setLoading] = useState(false);
  const [isLoggin, setIsLoggin] = useState(false);

  const { data: appData, isLoading: appLoading, isError, error } = useGetAppInfoQuery();

  const appInfo: AppData = appData?.app || {};
  const isRender = appData?.success && !isError;

  useEffect(() => {
    const token = TOKEN();
    setIsLoggin(!!token);
  }, []);

  const logout = async () => {
    await Cookies.remove('convocatoria_token');
    localStorage.removeItem('convocatoria_token');
    setLoading(true);
    Router.push('/');
  };

  const handleLoading = (value: boolean) => {
    setLoading(value);
  };

  if (appLoading) {
    return (
      <Fragment>
        <Head>
          <title>Cargando...</title>
        </Head>
        <LoadingGlobal display="block" />
      </Fragment>
    );
  }

  return (
    <Fragment>
      <Head>
        <title>{appInfo.name || 'Mesa de Partes'}</title>
        <meta charSet="utf-8" />
        <meta lang="es" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="description" content="Sistema de Trámite Documentario" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" type="image/x-icon" href={appInfo.icon || ASSET_PREFIX + 'img/loading_page.png'} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href={ASSET_PREFIX + 'css/bootstrap.css'} />
        <link rel="stylesheet" href={ASSET_PREFIX + 'font-awesome/css/all.min.css'} media="all" />
        <link rel="stylesheet" type="text/css" href={ASSET_PREFIX + 'css/app.css'} />
        <link rel="stylesheet" type="text/css" href={ASSET_PREFIX + 'css/page_loading.css'} />
      </Head>

      <LoadingGlobal display="none" id="loading-brand" />

      <Show condicion={!isRender}>
        <LoaderPage message={(error as any)?.message || 'Error al cargar la aplicación'} />
      </Show>

      <Show condicion={isRender}>
        <Show condicion={loading}>
          <LoadingGlobal display="block" />
        </Show>

        <div className={'min-h-screen flex flex-col theme-' + APP_THEME}>
          <Navbar app={appInfo} isLoggin={isLoggin} />

          <main className="flex-1">
            <Component
              {...pageProps}
              isLoggin={isLoggin}
              setLoading={handleLoading}
              isloading={loading}
              logout={logout}
            />
          </main>

          <Footer app={appInfo} />
        </div>
      </Show>
    </Fragment>
  );
};

const MyApp = ({ Component, pageProps }: any) => {
  return (
    <Provider store={store}>
      <AppContent Component={Component} pageProps={pageProps} />
    </Provider>
  );
};

export default MyApp;
