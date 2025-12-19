import React, { Fragment, useState, useEffect } from 'react'
import Router from 'next/router';
import Head from 'next/head';
import { app } from '../env.json'
import { TOKEN } from '../services/auth';
import 'semantic-ui-css/semantic.min.css';
import 'react-vertical-timeline-component/style.min.css';
import '../public/css/timeline.css';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import Show from '../components/show';
import LoaderPage from '../components/loaderPage';
import { authentication } from '../services/apis';
import LoadingGlobal from '../components/loadingGlobal';
import Cookies from 'js-cookie';

Router.onRouteChangeStart = () => {
    let loadingBrand = document.getElementById('loading-brand');
    if (loadingBrand) loadingBrand.style.display = 'block';
};

Router.onRouteChangeComplete = () => {
    let loadingBrand = document.getElementById('loading-brand');
    if (loadingBrand) loadingBrand.style.display = 'none';
};

Router.onRouteChangeError = () => {
    let loadingBrand = document.getElementById('loading-brand');
    if (loadingBrand) loadingBrand.style.display = 'none';
};

const MyApp = ({ Component, pageProps }) => {
    const [loading, setLoading] = useState(false);
    const [auth, setAuth] = useState({});
    const [isLoggin, setIsLoggin] = useState(false);
    const [is_render, setIsRender] = useState(false);
    const [__app, setApp] = useState({});
    const [message, setMessage] = useState("");
    const [appLoading, setAppLoading] = useState(true);

    useEffect(() => {
        fetchAppData();
    }, []);

    const fetchAppData = async () => {
        setAppLoading(true);
        await authentication.get('app/me')
            .then(res => {
                let { data } = res;
                if (!data.success) throw new Error(data.message);
                setApp(data.app);
                setIsRender(true);
            }).catch(err => {
                setIsRender(false);
                setMessage(err.message);
                setApp({});
            });

        const token = TOKEN();
        setIsLoggin(!!token);
        setAppLoading(false);
    }

    const logout = async () => {
        await Cookies.remove('convocatoria_token');
        localStorage.removeItem('convocatoria_token');
        setLoading(true);
        history.go('/');
    }

    const handleLoading = (value) => {
        setLoading(value);
    }

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
                <title>{ __app.name || 'Convocatorias' }</title>
                <meta charSet="utf-8" />
                <meta lang="es" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta name="description" content="Convocatoria de trabajos" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="shortcut icon" type="image/x-icon" href={ __app.icon || app.asset_prefix + 'img/loading_page.png' }></link>
                <link rel="stylesheet" href={app.asset_prefix + 'css/bootstrap.css'} />
                <link rel="stylesheet" id="google-fonts-1-css" href="https://fonts.googleapis.com/css?family=Roboto%3A100%2C100italic%2C200%2C200italic%2C300%2C300italic%2C400%2C400italic%2C500%2C500italic%2C600%2C600italic%2C700%2C700italic%2C800%2C800italic%2C900%2C900italic&ver=5.4.1" type="text/css" media="all" />
                <link rel="stylesheet" href={app.asset_prefix + 'font-awesome/css/all.min.css'} media="all" />
                <link rel="stylesheet" type="text/css" href={app.asset_prefix + 'css/app.css'} />
                <link rel="stylesheet" type="text/css" href={app.asset_prefix + 'css/page_loading.css'} />
            </Head>

            <LoadingGlobal display="none" id="loading-brand" />

            <Show condicion={ !is_render }>
                <LoaderPage message={ message } />
            </Show>

            <Show condicion={ is_render }>
                <Show condicion={ loading }>
                    <LoadingGlobal display="block" />
                </Show>

                <div className={ 'fondo theme-' + (app.theme || 'default') }>
                    <Navbar app={ __app } isLoggin={ isLoggin } logout={ logout } />

                    <div className="mt-5 pt-4">
                        <Component { ...pageProps } isLoggin={ isLoggin } setLoading={ handleLoading } isloading={ loading } logout={ logout } />
                    </div>
                </div>

                <Footer app={ __app } />
            </Show>

        </Fragment>
    )
}

export default MyApp;
