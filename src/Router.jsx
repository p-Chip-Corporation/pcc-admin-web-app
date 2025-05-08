// src/Router.jsx
import { Routes, Route } from "react-router";
import Home from "./routes/Home";
import Auth from "./routes/Auth";
import Accounts from "./routes/Accounts";
import Devices from "./routes/Devices";
import Users from "./routes/Users";
import AccountActiviation from "./routes/AccountActiviation";
import MainLayout from "./layouts/MainLayout";
import AccountDevices from "./routes/AccountDevices";
import AccountDetails from "./routes/details/AccountDetails";
import DeviceDetails from "./routes/details/DeviceDetails";
import UserDetails from "./routes/details/UserDetails";

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/accounts/:id" element={<AccountDetails />} />
        <Route path="/devices" element={<Devices />} />
        <Route path="/devices/:id" element={<DeviceDetails />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<UserDetails />} />
        <Route path="/account-activation" element={<AccountActiviation />} />
        <Route path="/account-devices" element={<AccountDevices />} />
      </Route>
      <Route path="/auth" element={<Auth />} />
    </Routes>
  );
}
