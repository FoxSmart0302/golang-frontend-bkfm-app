import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {createBrowserRouter, Navigate, Outlet, redirect, RouterProvider} from "react-router-dom";
import ManagerWrapper from "./pages/manager/ManagerWrapper.tsx";
import DashboardPage from "./pages/manager/DashboardPage.tsx";
import LoginPage from "./pages/auth/LoginPage.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import api from "./api/api.ts";
import ThemeProvider from "./context/theme/ThemeProvider.tsx";
import MeProvider from "./context/me/MeProvider.tsx";

import DriversListPage from './pages/manager/drivers/DriversListPage.tsx';
import DriversMultiCreatePage from './pages/manager/drivers/DriversMultiCreatePage.tsx';
import DriversOneCreatePage from './pages/manager/drivers/DriversOneCreatePage.tsx';
import DriversShowPage from './pages/manager/drivers/DriversShowPage.tsx';
import DriversEditPage from './pages/manager/drivers/DriversEditPage.tsx';
import DriversPdfPage from './pages/manager/drivers/DriversPdfPage.tsx';

import CompaniesListPage from "./pages/manager/companies/CompaniesListPage.tsx";
import CompanyCreatePage from "./pages/manager/companies/CompanyCreatePage.tsx";
import CompanyShowPage from './pages/manager/companies/CompanyShowPage.tsx';
import CompanyEditPage from './pages/manager/companies/CompanyEditPage.tsx';

import CoursesPage from "./pages/manager/courses/CoursesPage.tsx";
import CreateCoursePage from "./pages/manager/courses/CreateCoursePage.tsx";

import InstructorsPage from "./pages/manager/instructors/InstructorsPage.tsx";
import CreateInstructorPage from "./pages/manager/instructors/CreateInstructorPage.tsx";

import LocationsPage from "./pages/manager/locations/LocationsPage.tsx";
import CreateLocationPage from "./pages/manager/locations/CreateLocationPage.tsx";

import CoursePage from "./pages/manager/courses/CoursePage.tsx";
import CoursePdfPage from "./pages/manager/courses/CoursePdfPage.tsx";
import CreateToastr from './components/utils/toastr.tsx';

const queryClient = new QueryClient()

const router = createBrowserRouter([
    {
        path: "/",
        element: <Outlet/>,
        children: [
            {
                path: "",
                element: <Navigate to={"/login"}/>,
            },
            {
                path: "manager",
                element: <ManagerWrapper/>,
                loader: async () => {
                    try {
                        const me = await api.get("/api/v1/auth/me");
                        if (me.status === 200 && me.data.manager) {
                            return null;
                        } else if (me.status === 200 && me.data.driver) {
                            return redirect("/driver");
                        } else {
                            return redirect("/login");
                        }
                    } catch (e) {
                        return redirect("/login");
                    }
                },
                children: [
                    {
                        path: "drivers",
                        children: [
                            {
                                path: "",
                                element: <DriversListPage/>
                            },
                            {
                                path: "create",
                                element: <DriversMultiCreatePage/>
                            },
                            {
                                path: "createone",
                                element: <DriversOneCreatePage />
                            },
                            {
                                path: ":id",
                                element: <DriversShowPage />
                            },
                             {
                                path: "edit/:id",
                                element: <DriversEditPage />
                            }
                        ]
                    },
                    {
                        path: "companies",
                        children: [
                            {
                                path: "",
                                element: <CompaniesListPage/>
                            },
                            {
                                path: "create",
                                element: <CompanyCreatePage/>
                            },
                            {
                                path: ":id",
                                element: <CompanyShowPage/>
                            },
                             {
                                path: "edit/:id",
                                element: <CompanyEditPage/>
                            },
                        ]
                    },
                    {
                        path: "instructors",
                        children: [
                            {
                                path: "",
                                element: <InstructorsPage/>
                            },
                            {
                                path: "create",
                                element: <CreateInstructorPage/>
                            }
                        ]
                    },
                    {
                        path: "courses",
                        children: [
                            {
                                path: "",
                                element: <CoursesPage/>,
                                children: [
                                    {
                                        path: ":id",
                                        element: <CoursePage/>
                                    },
                                ]
                            },
                            {
                                path: "create",
                                element: <CreateCoursePage/>
                            }
                        ]
                    },
                    {
                        path: "locations",
                        children: [
                            {
                                path: "",
                                element: <LocationsPage/>
                            },
                            {
                                path: "create",
                                element: <CreateLocationPage/>
                            }
                        ]
                    },
                    {
                        path: "dashboard",
                        element: <DashboardPage/>,
                    },
                    {
                        path: "",
                        element: <Navigate to={"/manager/dashboard"}/>,
                    }
                ]
            },
            {
                path: "logout",
                loader: () => {
                    localStorage.removeItem("token");
                    return null;
                },
                element: <Navigate to={"/login"}/>,
            },
            {
                path: "login",
                loader: async () => {
                    try {
                        const me = await api.get("/api/v1/auth/me");
                        if (me.status === 200 && me.data.manager) {
                            return redirect("/manager");
                        } else if (me.status === 200 && !me.data.manager) {
                            return redirect("/driver");
                        } else {
                            return null;
                        }
                    } catch (e) {
                        return null;
                    }
                },
                element: <LoginPage/>,
            }
        ],
    },
    {
        path: "/manager/courses/:id/pdf",
        element: <CoursePdfPage/>,
    },
    {
        path: "/manager/drivers/:id/pdf",
        element: <DriversPdfPage/>,
    }
]);


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
                <MeProvider>
                    <RouterProvider router={router}/>
                </MeProvider>
            </ThemeProvider>
        </QueryClientProvider>
        <CreateToastr />
    </React.StrictMode>,
)
