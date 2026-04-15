import Navbar from "./Navbar";
import Footer from "./Footer";
import ChatWidget from "./ChatWidget";
import ShoppingAssistant from "./ShoppingAssistant";
import { Outlet } from "react-router-dom";

function UserLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
      <ChatWidget />
      <ShoppingAssistant />
    </>
  );
}

export default UserLayout;