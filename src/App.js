import React, { useEffect } from "react";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { ConfigProvider, Spin } from "antd";
import { auth } from "./firebase";

// pages
import Home from "./pages/Home";
import About from "./pages/About";
import CreateAccount from "./pages/CreateAccount";
import Services from "./pages/Services";

import Dashboard from "./pages/private/Dashboard";
import Requests from "./pages/private/Requests";
import Faq from "./pages/private/Faq";
import Businesses from "./pages/Businesses";

// admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminRequests from "./pages/admin/AdminRequests";
import AdminRequestDetails from "./pages/admin/AdminRequestDetails";
import AdminBusinesses from "./pages/admin/AdminBusinesses";

// layouts
import PublicRootLayout from "./layouts/PublicRootLayout";
import PrivateRootLayout from "./layouts/PrivateRootLayout";
import { useUserStore } from "./stores/userStore";
import { getUserData } from "./services/user";
import { usePageLoaderStore } from "./stores/pageLoaderStore";

function App() {
  const { isLoading, isAuthenticated, setLoading, onLogin, onLogout, role } =
    useUserStore();
  const { isPageLoading } = usePageLoaderStore();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      try {
        console.log(user, "user from state change");
        if (!user) {
          await onLogout();
          return;
        }
        const userData = await getUserData(user.uid);
        await onLogin(userData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return <Spin />;
  }

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route
        path="/"
        element={isAuthenticated ? <PrivateRootLayout /> : <PublicRootLayout />}
      >
        {isAuthenticated ? (
          <>
            {role === "admin" ? (
              <>
                <Route index element={<AdminDashboard />} />
                <Route path="requests">
                  <Route index element={<AdminRequests />} />
                  <Route path=":id" element={<AdminRequestDetails />} />
                </Route>
                <Route path="businesses" element={<AdminBusinesses />} />
              </>
            ) : (
              <>
                <Route index element={<Dashboard />} />
                <Route path="requests" element={<Requests />} />

                <Route path="faq" element={<Faq />} />
              </>
            )}
          </>
        ) : (
          <>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="create-account" element={<CreateAccount />} />
          </>
        )}

        <Route path="businesses" element={<Businesses />} />
        <Route path="services" element={<Services />} />
      </Route>
    )
  );

  return (
    <ConfigProvider
      theme={{
        token: {
          // Seed Token
          borderRadius: 2,
          fontFamily: "Poppins",
          colorPrimary: "#003b7f",
        },
        components: {
          Menu: {
            borderBottom: "none",
            activeBarHeight: 3,
            colorText: "white",
            groupTitleColor: "green",
            horizontalItemSelectedColor: "yellow",
            colorBgContainer: "#00264d",
            fontFamily: "Poppins",
            fontSize: 16,
          },
        },
      }}
    >
      <Spin spinning={isPageLoading} size="large" tip="Loading...">
        <RouterProvider router={router} />
      </Spin>
    </ConfigProvider>
  );
}

export default App;
