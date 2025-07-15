// src/routes/router.tsx

import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  redirect,
} from '@tanstack/react-router';

import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Customers from '../pages/Customers';
import Areas from '../pages/Areas'; // ✅ Add import
import MonthlyStatus from '../pages/MonthlyStatus'; // ✅ Add this
import AddPayment from '../pages/AddPayment'; // ✅
import DailyIncome from '../pages/DailyIncome';
import { isLoggedIn } from '../utils/auth'; // ✅ utility to check token

import Income from '../pages/Income';





// 1️⃣ Root route
const rootRoute = createRootRoute({
  component: () => <Outlet />, // layout wrapper
});

// 2️⃣ Public routes
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: Login,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: Register,
});
const rootRedirectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    if (isLoggedIn()) {
      throw redirect({ to: '/dashboard' });
    } else {
      throw redirect({ to: '/login' });
    }
  },
});


// 3️⃣ Protected Dashboard route
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: Dashboard,
  beforeLoad: () => {
    if (!isLoggedIn()) {
      throw redirect({ to: '/login' });
    }
  },
});
const customersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/customers',
  component: Customers,
  beforeLoad: () => {
    if (!isLoggedIn()) {
      throw redirect({ to: '/login' });
    }
  },
});
const areasRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/areas',
  component: Areas,
  beforeLoad: () => {
    if (!isLoggedIn()) throw redirect({ to: '/login' });
  },
});
const paymentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payments',
  component: MonthlyStatus,
  beforeLoad: () => {
    if (!isLoggedIn()) throw redirect({ to: '/login' });
  },
});
const addPaymentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/add-payment',
  component: AddPayment,
  beforeLoad: () => {
    if (!isLoggedIn()) throw redirect({ to: '/login' });
  },
});
const incomeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/income',
  component: Income,
  beforeLoad: () => {
    if (!isLoggedIn()) throw redirect({ to: '/login' });
  },
});

const dailyIncomeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/daily-income',
  component: DailyIncome,
  beforeLoad: () => {
    if (!isLoggedIn()) throw redirect({ to: '/login' });
  },
});

// 4️⃣ Build route tree
const routeTree = rootRoute.addChildren([
    rootRedirectRoute, 
  loginRoute,
  registerRoute,
  dashboardRoute,
  customersRoute,
  areasRoute,
  paymentsRoute,
   addPaymentRoute,
   incomeRoute,
   dailyIncomeRoute,
]);

// 5️⃣ Export router
export const router = createRouter({ routeTree });
