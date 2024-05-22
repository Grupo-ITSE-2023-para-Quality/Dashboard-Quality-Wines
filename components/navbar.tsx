import { UserButton } from "@clerk/nextjs";

import { MainNav } from "@/components/main-nav";
<<<<<<< Updated upstream
=======
import StoreSwitcher from "@/components/store-switcher";

>>>>>>> Stashed changes
const Navbar = () => {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
<<<<<<< Updated upstream
        <div>This will be a store switcher</div>
=======
        <StoreSwitcher items={[]} /> 
>>>>>>> Stashed changes
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
<<<<<<< Updated upstream
  );
=======
  ); 
>>>>>>> Stashed changes
};
export default Navbar;
