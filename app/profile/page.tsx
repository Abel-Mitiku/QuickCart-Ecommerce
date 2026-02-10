"use client";
import { Navigation } from "./components/navigation";
import AccountDashboard from "./components/dashboard";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const res = await fetch("/api/checkLogin", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      console.log(data);
      if (!data.success) {
        router.push("/login");
      } else {
        console.log("logged in");
      }
    };
    checkUser();
  }, []);
  return (
    <div>
      <Navigation />
      <AccountDashboard />
    </div>
  );
}
