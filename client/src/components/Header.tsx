import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { handleError } from "@/utils/handleError";
import { useLogoutMutation } from "@/redux/slices/api";
import { updateCurrentUser, updateIsLoggedIn } from "@/redux/slices/appSlice";
import { updateIsOwner } from "@/redux/slices/compilerSlice";
import { GiHamburgerMenu } from "react-icons/gi";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { useState } from "react";

export default function Header() {
  const [logout, { isLoading }] = useLogoutMutation();
  const [sheetOpen, setSheetOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const windowWidth = useSelector(
    (state: RootState) => state.appSlice.windowWidth
  );
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(
    (state: RootState) => state.appSlice.isLoggedIn
  );

  async function handleLogout() {
    try {
      await logout().unwrap();
      dispatch(updateIsLoggedIn(false));
      dispatch(updateCurrentUser({}));
      dispatch(updateIsOwner(false));
      navigate("/");
    } catch (error) {
      handleError(error);
    }
  }

  const handleCloseSheet = () => {
    setSheetOpen(false);
  };

  return (
    <nav className="w-full h-[60px] bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white p-3 flex justify-between items-center shadow-md">
      <Link
        to="/"
        className="text-lg font-extrabold tracking-wide select-none bg-gradient-to-r from-blue-200 to-blue-500 text-transparent bg-clip-text"
      >
        CodeCraft
      </Link>
      {windowWidth > 640 ? (
        <ul className="flex gap-4">
          <li>
            <Link to="/compiler">
              <Button variant="link" className="text-white hover:text-blue-400">
                Compiler
              </Button>
            </Link>
          </li>
          <li>
            <Link to="/all-codes">
              <Button variant="link" className="text-white hover:text-blue-400">
                All Codes
              </Button>
            </Link>
          </li>
          {isLoggedIn ? (
            <>
              <li>
                <Link to="/my-codes">
                  <Button
                    className="w-full text-white hover:text-blue-400"
                    variant="link"
                  >
                    My Codes
                  </Button>
                </Link>
              </li>
              <li>
                <Button
                  loading={isLoading}
                  onClick={handleLogout}
                  variant="destructive"
                  className="hover:bg-red-600"
                >
                  Logout
                </Button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login">
                  <Button variant="success">Login</Button>
                </Link>
              </li>
              <li>
                <Link to="/signup">
                  <Button variant="success">Signup</Button>
                </Link>
              </li>
            </>
          )}
        </ul>
      ) : (
        <div>
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-400 hover:to-blue-600 transition duration-300 ease-in-out shadow-md">
                <GiHamburgerMenu size={24} />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full bg-gray-800 text-white">
              <ul className="flex flex-col gap-4 py-5">
                <li>
                  <Link to="/compiler">
                    <Button
                      onClick={handleCloseSheet}
                      className="w-full text-white hover:text-blue-400"
                      variant="link"
                    >
                      Compiler
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link to="/all-codes">
                    <Button
                      onClick={handleCloseSheet}
                      className="w-full text-white hover:text-blue-400"
                      variant="link"
                    >
                      All Codes
                    </Button>
                  </Link>
                </li>
                {isLoggedIn ? (
                  <>
                    <li>
                      <Link to="/my-codes">
                        <Button
                          onClick={handleCloseSheet}
                          className="w-full text-white hover:text-blue-400"
                          variant="link"
                        >
                          My Codes
                        </Button>
                      </Link>
                    </li>
                    <li>
                      <Button
                        loading={isLoading}
                        onClick={async () => {
                          await handleLogout();
                          handleCloseSheet();
                        }}
                        variant="destructive"
                        className="w-full hover:bg-red-600"
                      >
                        Logout
                      </Button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link to="/login">
                        <Button
                          onClick={handleCloseSheet}
                          className="w-full"
                          variant="success"
                        >
                          Login
                        </Button>
                      </Link>
                    </li>
                    <li>
                      <Link to="/signup">
                        <Button
                          onClick={handleCloseSheet}
                          className="w-full"
                          variant="success"
                        >
                          Signup
                        </Button>
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </SheetContent>
          </Sheet>
        </div>
      )}
    </nav>
  );
}
