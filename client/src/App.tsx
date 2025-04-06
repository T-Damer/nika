import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { UserProvider } from "./contexts/user-context";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Onboarding from "@/pages/onboarding";
import Calendar from "@/pages/calendar";
import Log from "@/pages/log";
import Insights from "@/pages/insights";
import Profile from "@/pages/profile";

function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/log" element={<Log />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </UserProvider>
  );
}

export default App;
