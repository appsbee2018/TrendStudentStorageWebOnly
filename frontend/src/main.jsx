import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { CookiesProvider } from 'react-cookie';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/login/login'
import Register from './pages/login/register'
import Verify from './pages/login/verify'
import CreatePassword from './pages/login/createPassword'
import UnderConstruction from './pages/underConstruction'
import StudentLayout from './pages/studentlayout';
import StudentHome from './pages/student/studenthome';
import ManagerLayout from './pages/managerlayout';
import ManagerHome from './pages/manager/managerhome';
import ManagerSettings from './pages/manager/managersettings';
import Logs from './pages/manager/logs';
import TermsAndConditions from './pages/student/termsandconditions';
import CreateOrder from './pages/student/createorder';
import Order from './pages/student/order';
import ForgotPassword from './pages/login/forgotpassword';
import UpdateOrder from './pages/student/updateorder';
import ErrorElement from './pages/errorelement';
import PackingTips from './pages/student/packingtips';
import FAQ from './pages/student/faq';
import Students from './pages/manager/students';
import Orders from './pages/manager/orders';
import StudentView from './pages/manager/studentview';
import OrderView from './pages/manager/orderview';
import Items from './pages/manager/items';

const router = createBrowserRouter([
  // {
  //   path: "/",
  //   element: <UnderConstruction />,
  //   errorElement: <ErrorElement />
  // },
  {
    path: "/",
    element: <Login />,
    errorElement: <ErrorElement />
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <ErrorElement />
  },
  {
    path: "/register",
    element: <Register />,
    errorElement: <ErrorElement />
  },
  {
    path: "/register/verify/:id",
    element: <Verify />,
    errorElement: <ErrorElement />
  },
  {
    path: "/register/createpassword/:id/:registrationcode",
    element: <CreatePassword />,
    errorElement: <ErrorElement />
  },
  {
    path: "/studentdashboard/home",
    element: <StudentLayout page={<StudentHome />} />,
    errorElement: <ErrorElement />
  }, 
  {
    path: "/managerdashboard/home",
    element: <ManagerLayout page={<ManagerHome />} />,
    errorElement: <ErrorElement />
  },
  {
    path: "/managerdashboard/settings",
    element: <ManagerLayout page={<ManagerSettings />} />,
    errorElement: <ErrorElement />
  }, 
  {
    path: "/managerdashboard/logs",
    element: <ManagerLayout page={<Logs />} />,
    errorElement: <ErrorElement />
  },
  {
    path: "studentdashboard/termsandconditions",
    element: <StudentLayout page={<TermsAndConditions />} />,
    errorElement: <ErrorElement />
  },
  {
    path: "studentdashboard/createorder",
    element: <StudentLayout page={<CreateOrder />} />,
    errorElement: <ErrorElement />
  },
  {
    path: "studentdashboard/order/:orderID",
    element: <StudentLayout page={<Order />} />,
    errorElement: <ErrorElement />
  },
  {
    path: "/forgotpassword",
    element: <ForgotPassword />,
    errorElement: <ErrorElement />
  },
  {
    path: "/studentdashboard/order/updateorder/:orderID",
    element: <StudentLayout page={<UpdateOrder />} />,
    errorElement: <ErrorElement />
  },
  {
    path: "/studentdashboard/packingtips",
    element: <StudentLayout page={<PackingTips />} />,
    errorElement: <ErrorElement />
  },
  {
    path: "/studentdashboard/faq",
    element: <StudentLayout page={<FAQ />} />,
    errorElement: <ErrorElement />
  },
  {
    path: "/managerdashboard/students",
    element: <ManagerLayout page={<Students />} />,
    errorElement: <ErrorElement />
  },
  {
    path: "/managerdashboard/orders",
    element: <ManagerLayout page={<Orders />} />,
    errorElement: <ErrorElement />
  },
  {
    path: "/managerdashboard/items",
    element: <ManagerLayout page={<Items />} />,
    errorElement: <ErrorElement />
  },
  {
    path: "/managerdashboard/studentview",
    element: <ManagerLayout page={<StudentView />} />,
    errorElement: <ErrorElement />
  },
  {
    path: "/managerdashboard/orderview",
    element: <ManagerLayout page={<OrderView />} />,
    errorElement: <ErrorElement />
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CookiesProvider defaultSetOptions={{ path: '/' }} >
      <RouterProvider router={router} />
      <ToastContainer />
    </CookiesProvider>
  </StrictMode>,
)
