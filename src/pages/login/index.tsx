import React from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import * as H from 'history';
import {Button, Form, Input} from 'antd';
import {useAuth} from '@/hooks';


interface LoginState {
    from: H.Location;
}

const layout = {
    labelCol: {span: 8},
    wrapperCol: {span: 10},
};
const tailLayout = {
    wrapperCol: {offset: 8, span: 16},
};

function LoginPage() {
    const history = useHistory();
    const location = useLocation<LoginState>();
    const auth = useAuth();
    const {from} = location.state || {from: {pathname: '/'}};
    if (auth.user) {
        history.replace(from);
        return null;
    }
    const onFinish = (values: any) => {
        const {username, password} = values;
        auth.login({
            username,
            password,
            callback: (result) => {
                if (result) {
                    history.replace(from);
                }
            },
        });
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Form
            {...layout}
            style={{
                marginTop: '200px',
            }}
            name="basic"
            initialValues={{
                username: '',
                password: '',
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
        >
            <Form.Item
                label="Username"
                name="username"
                rules={[{required: true, message: 'Please input your username!'}]}
            >
                <Input/>
            </Form.Item>

            <Form.Item
                label="Password"
                name="password"
                rules={[{required: true, message: 'Please input your password!'}]}
            >
                <Input.Password/>
            </Form.Item>

            <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
}

export default LoginPage;
