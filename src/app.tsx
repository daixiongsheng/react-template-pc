import React, {useEffect, useState} from 'react';
import {useLocation} from 'react-router-dom';
import {Inspector} from 'react-dev-inspector';

import routes from '@/config/routes';
import BaseLayout from './layouts/baseLayout';
import './app.less';

const InspectorWrapper = process.env.NODE_ENV === 'development' ? Inspector : React.Fragment;

const App: React.FC = (): React.ReactElement => {
    const [Layout, setLayout] = useState(<div/>);
    const location = useLocation();
    useEffect(() => {
        let Layout = BaseLayout;
        const {pathname} = location;
        for (const route of routes) {
            if (route.path === pathname && route.component) {
                Layout = route.component;
                break;
            }
        }
        setLayout(<Layout/>);
    }, [location.pathname]);
    return (
        <InspectorWrapper>
            {Layout}
        </InspectorWrapper>
    );
};

export default App;
