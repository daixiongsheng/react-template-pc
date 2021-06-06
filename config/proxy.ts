import fs from 'fs';
import path from 'path';

let mockData: Record<string, any> = {};

fs.watch(path.resolve(__dirname, '..', 'mock'), update);

async function getMockData(p = path.resolve(__dirname, '..', 'mock')) {
    mockData = {};
    const files = fs.readdirSync(p);
    for (const file of files) {
        const absolutePath = path.join(p, file);
        if (!fs.existsSync(absolutePath)) {
            continue;
        }
        const stat = fs.statSync(absolutePath);
        if (stat.isDirectory()) {
            await getMockData(path.join(p, absolutePath));
        }
        else if (stat.isFile()) {
            try {
                const code = fs.readFileSync(absolutePath).toString();
                const module = eval(code);
                if(!module.enable) {
                    return;
                }
                const keys = Object.keys(module);
                keys.forEach(key => {
                    mockData[key] = module[key];
                });
            }
            catch (e) {
                console.log(e);
            }
        }
    }
}

const proxy = {
    '^/api': {
        // @ts-ignore
        bypass: async function (req, res, proxyOptions) {
            res.setHeader('Content-Type', 'application/json;charset=utf-8')
            const {url = ''} = req;
            if (!url.startsWith('/api') || !mockData[url]) {
                return res;
            }
            const data = mockData[url];
            if (typeof data === 'function') {
                if (data.length) {
                    data(req, res);
                    return res;
                }
                else {
                    res.end(JSON.stringify(data()));
                }
            }
            else {
                res.end(JSON.stringify(mockData[url]));
            }
            return res;
        },
    },
};


async function update() {
    await getMockData();
}

update();
export default proxy;
