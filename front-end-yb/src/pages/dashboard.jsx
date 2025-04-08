import HeroPage from "./hero";
import Aurora from "./main";
import NavbarPage from "./navbar";

const DashboardPage = () => {
  return (
    <div className="bg-black h-screen w-full">
      <NavbarPage />
      <HeroPage />
    </div>
  );
};

export default DashboardPage;
