
// @ts-nocheck
function success(data, msg = '', code = 0) {
    return {
        code,
        msg,
        data,
    };
}

exports.default = {
    enable: true,
    '/api/user/login': success({
        success: true,
        userInfo: {
            username: 'LiLi22',
        },
        token: 'token'
    }),

    '/api/user/info': (req, res) => {
        res.end(JSON.stringify(success({
            username: 'LiMing123',
        })));
    },

    '/api/users/create': success({
        name: 8,
    }),
};
