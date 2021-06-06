import React, {useMemo, useState} from 'react';
import {
    Route, Redirect, Switch
} from 'react-router-dom';

import {Layout} from 'antd';
import routes, {RouteItem} from '@/config/routes';
import {defaultSettings, logo} from '@/config';
import {useAuth} from '@/hooks';
import CustomHeader from './header';
import CustomFooter from './footer';
import SideBar from './menu';
import HomePage from '@/pages/index';

const {Content} = Layout;

const PrivateRoute: React.FC<any> = (props) => {
    const {children, component, path, auth: needAuth = false, location, ...rest} = props;
    const auth = useAuth();
    return (
        <>
            {
                !auth.user && needAuth
                    ? (
                        <Redirect
                            to={{
                                pathname: '/login',
                                state: {from: location},
                            }}
                        />
                    )
                    : (
                        <Route
                            {...rest}
                            path={path}
                            component={component}
                        />
                    )
            }
        </>
    );
};

const cleanRoutes = (routes: RouteItem[], needAuth = false): RouteItem[] => {
    return routes.map(route => {
        if (route.hideInRoute) {
            return null;
        }
        const finalRoute = {auth: needAuth, ...route};
        const auth = finalRoute.auth;
        if (route.children) {
            return cleanRoutes(route.children, auth);
        }
        return finalRoute;
    }).filter(Boolean).flat(1) as RouteItem[];
};


const BaseLayout: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [theme] = useState<'light' | 'dark'>(defaultSettings.theme);
    const siderWidth = 208;
    const cleanRoute = useMemo(() => cleanRoutes(routes), [routes]);
    return (
        <Layout
            style={{
                minHeight: '100%',
            }}>
            <SideBar
                title="hello"
                routes={routes}
                collapsed={collapsed}
                onCollapse={setCollapsed}
                logo={logo}
                theme={theme}
            />
            <Layout>
                <CustomHeader
                    theme={theme}
                    headerHeight={48}
                    collapsed={collapsed}
                    siderWidth={siderWidth}
                />
                <Content style={{margin: '24px 16px 0'}}>
                    <Switch>
                        {
                            cleanRoute.map((route, index) => (
                                <PrivateRoute {...route} key={index}/>
                            ))
                        }
                        <Route path="/" exact component={HomePage} />
                    </Switch>
                </Content>
                <CustomFooter/>
            </Layout>
        </Layout>
    );
};

export default BaseLayout;
