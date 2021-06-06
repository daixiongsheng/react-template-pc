import React from 'react';
import {Avatar, Dropdown} from 'antd';
import {logo} from '@/config';
import {useAuth} from '@/hooks';

import {Layout, Menu} from 'antd';
import {
    LogoutOutlined,
    SettingOutlined,
    UserOutlined,
} from '@ant-design/icons';
import {useHistory} from 'react-router-dom';

const {Header} = Layout;

export interface HeaderProps {
    headerHeight?: number | string;
    collapsed?: boolean;
    siderWidth?: string | number;
    theme?: string;
    style?: Record<string, any>;
}

const CustomHeader: React.FC<HeaderProps> = (props) => {
    const {
        headerHeight,
        collapsed,
        siderWidth,
        theme = 'light',
        children,
        style,
    } = props;
    const history = useHistory();
    const auth = useAuth();
    const width = `calc(100% - ${collapsed ? 48 : siderWidth}px)`;
    const logout = () => {
        auth.logout(() => {
            history.replace('/login');
        });
    };

    const menuHeaderDropdown = (
        <Menu selectedKeys={[]}>
            <Menu.Item key="center">
                <UserOutlined/>
                个人中心
            </Menu.Item>

            <Menu.Item key="settings">
                <SettingOutlined/>
                个人设置
            </Menu.Item>
            <Menu.Divider/>
            <Menu.Item key="logout" onClick={logout}>
                <LogoutOutlined/>
                退出登录
            </Menu.Item>
        </Menu>
    );
    return (
        <>
            {/*空的占位*/}
            <Header
                style={{
                    height: headerHeight,
                    lineHeight: `${headerHeight}px`,
                    background: 'transparent',
                    padding: '0 10px',
                    transition: `background-color 0.3s, width 0.3s, max-width 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)`,
                    ...style,
                }}
            />
            <Header
                style={{
                    height: headerHeight,
                    lineHeight: `${headerHeight}px`,
                    width,
                    zIndex: 19,
                    right: 0,
                    top: 0,
                    padding: '0 10px',
                    background: theme === 'dark' ? void 0 : '#fff',
                    transition: `background-color 0.3s, width 0.3s, max-width 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)`,
                    ...style,
                }}
                className="fixed flex"
            >
                <div className="flex-1">{children}</div>
                <div className="flex float-right items-center">
                    <Dropdown overlay={menuHeaderDropdown}>
                        <span style={{minWidth: '80px', verticalAlign: 'middle'}} className="cursor-pointer">
                            <Avatar size="small" src={logo} alt="avatar"/>
                            <span style={{
                                marginLeft: '8px',
                            }}>{auth.user?.username}</span>
                        </span>
                    </Dropdown>
                </div>
            </Header>
        </>
    );
};

export default CustomHeader;
