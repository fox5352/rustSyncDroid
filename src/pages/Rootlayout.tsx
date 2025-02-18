import { Outlet } from "react-router-dom";
import { useSession } from "../store/Session";

function Rootlayout() {
  return (
    <>
      <Outlet />
    </>
  );
}

export default Rootlayout;
