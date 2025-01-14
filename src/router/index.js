export const PATHS = {
    NOT_FOUND: '../components/404_not_found/404.html',
    REGISTER_EMPLOYEE: '/src/pages/register_employee/register_employee.html',
    HOME: '/src/pages/home_screen/home_screen.html',
    LOGIN: '/src/pages/login/login.html'
};

export class Router {
    constructor(routes) {
        this.routes = routes;
        this.root = document.getElementById('app');
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.render().catch(this.handleError);
    }

    setupEventListeners() {
        window.addEventListener('popstate', () => this.render().catch(this.handleError));
    }

    navigate(path) {
        try {
            const route = this.findRoute(path);
            if (!route) {
                this.redirectTo404();
                return;
            }
            window.history.pushState({}, '', path);
            return this.render();
        } catch (error) {
            this.handleError(error);
        }
    }

    findRoute(path) {
        return this.routes.find(route => route.path === path);
    }

    async render() {
        try {
            const path = window.location.pathname;
            const route = this.findRoute(path);

            if (!route) {
                this.redirectTo404();
                return;
            }

            const Component = await route.component();
            const component = new Component();
            await component.mount();
        } catch (error) {
            this.handleError(error);
        }
    }

    handleError = (error) => {
        console.error('Router Error:', error);
        this.redirectTo404();
    }

    redirectTo404 = () => {
        window.location.href = PATHS.NOT_FOUND;
    }
}

export const routes = [
    {
        path: '/',
        component: () => import('../views/Login.js'),
        auth: false
    },
    {
        path: '/home_screen',
        component: () => import('../views/Dashboard.js'),
        auth: true
    },
    {
        path: '/dashboard',
        component: () => import('../views/Dashboard.js'),
        auth: true
    },
    {
        path: '/login',
        component: () => import('../views/Login.js'),
        auth: false
    },
    {
        path: '/register_employee',
        component: () => {
            window.location.href = PATHS.REGISTER_EMPLOYEE;
            return Promise.resolve({});
        },
        auth: true
    },
    {
        path: '/error',
        component: () => import('../views/Error.js'),
        auth: false
    }
];
