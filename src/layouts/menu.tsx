import React, {useMemo} from 'react';
import {Layout, Menu} from 'antd';
import {MenuUnfoldOutlined, MenuFoldOutlined} from '@ant-design/icons';
import {RouteItem} from '@/config/routes';
import {useHistory, useLocation} from 'react-router-dom';

const {Sider} = Layout;
const {SubMenu} = Menu;

export const defaultRenderLogo = (logo: React.ReactNode): React.ReactNode => {
    if (typeof logo === 'string') {
        return <img src={logo} style={{width: '40px'}} alt="logo"/>;
    }
    if (typeof logo === 'function') {
        return logo();
    }
    return logo;
};
const defaultRenderCollapsedButton = (collapsed?: boolean) => collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>;

const defaultRenderLogoAndTitle = (props: SiderMenuProps, collapsed: boolean): React.ReactNode => {
    const {logo, title} = props;
    const logoDom = defaultRenderLogo(logo);
    const titleDom = <h1>{title}</h1>;
    return (<a
        className="flex relative -align-center cursor-pointer"
        style={{
            padding: '16px',
        }}
    >
        {logoDom}
        {collapsed ? null : titleDom}
    </a>);
};

function clearMenuItem(menusData: RouteItem[]): RouteItem[] {
    return menusData
        .map((item) => {
            const finalItem = {...item};
            if (finalItem.hideInMenu) {
                return null;
            }

            if (finalItem && finalItem?.children) {
                if (finalItem.children.some((child) => child && !child.hideInMenu)) {
                    return {
                        ...item, children: clearMenuItem(finalItem.children),
                    };
                }
                delete finalItem.children;
            }
            return finalItem;
        })
        .filter(Boolean) as RouteItem[];
}

function renderMenu(menuData: RouteItem[]) {
    return menuData.map((menu, index) => {
        return (<React.Fragment key={index}>
            {menu.children ? (<SubMenu title={menu.name} key={menu.path}>
                {renderMenu(menu.children)}
            </SubMenu>) : !menu.hideInMenu ? (<Menu.Item key={menu.path}>
                {menu.name || menu.path}
            </Menu.Item>) : null}
        </React.Fragment>);
    });
}


export interface SiderMenuProps {
    title?: string;
    logo?: string | React.ReactNode;
    routes: RouteItem[];
    onCollapse?: Function;
    collapsed: boolean;
    theme?: 'light' | 'dark';
    siderWidth?: string;
    style?: Record<string, any>;
    links?: string[];
}

const SideBar: React.FC<SiderMenuProps> = (props) => {
    const {
        routes,
        onCollapse,
        theme = 'light',
        siderWidth = 208,
        style,
        collapsed,
        links,
    } = props;
    const location = useLocation();
    const selectedKey = location.pathname === '/' ? '/home' : location.pathname
    const collapsedButtonRender = defaultRenderCollapsedButton;
    const menuData = clearMenuItem(routes);
    const headerDom = defaultRenderLogoAndTitle(props, collapsed);
    const renderMenuDom = useMemo(() => {
        return renderMenu(menuData);
    }, [menuData]);
    const history = useHistory();
    return (<div
        style={{
            width: `${collapsed ? 48 : siderWidth}px`,
            overflow: 'hidden',
            flex: `0 0 ${collapsed ? 48 : siderWidth}px`,
            maxWidth: `${collapsed ? 48 : siderWidth}px`,
            minWidth: `${collapsed ? 48 : siderWidth}px`,
            transition: `background-color 0.3s, min-width 0.3s, max-width 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)`, ...style,
        }}
    >
        <Sider
            collapsible
            theme={theme}
            trigger={null}
            collapsed={collapsed}
            breakpoint="lg"
            onCollapse={(collapse) => {
                onCollapse?.(collapse);
            }}
            collapsedWidth={48}
            style={{
                overflow: 'hidden', ...style, minHeight: '100%', height: '100%',
            }}
            width={siderWidth}
            className="menu-sider"
        >
            {headerDom}
            <div
                className="overflow-hidden flex-1"
            >
                <Menu
                    theme={theme}
                    inlineIndent={16}
                    defaultSelectedKeys={[selectedKey]}
                    defaultOpenKeys={['/']}
                    mode="inline"
                    onSelect={ ({key}) => {
                        history.push(key)
                    }}
                    style={{
                        flex: '1 1 0',
                    }}
                >
                    {renderMenuDom}
                </Menu>
            </div>
            <div>
                <Menu
                    theme={theme}
                    mode="inline"
                    inlineIndent={16}
                    selectedKeys={[]}
                    openKeys={[]}
                >
                    {(links || []).map((node, index) => (<Menu.Item key={index}>
                        {node}
                    </Menu.Item>))}
                    <Menu.Item
                        style={{
                            alignItems: 'end',
                        }}
                        title={false}
                        key="collapsed"
                        onClick={() => {
                            onCollapse?.(!collapsed);
                        }}
                    >
                        {collapsedButtonRender(collapsed)}
                    </Menu.Item>
                </Menu>
            </div>
        </Sider>
    </div>);
};

export default SideBar;
