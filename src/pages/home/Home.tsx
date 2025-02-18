import { Navigate } from "react-router-dom";
import { useSession } from "../../store/Session";

export default function Home() {
  const { data } = useSession();

  if (data == null) {
    return <Navigate to="/sync" />;
  }

  // TODO: add fetching of data from api using the session data

  return (
    <div>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit numquam
      architecto doloribus est, voluptatem magni temporibus consequatur
      molestias, pariatur odit quas rem, voluptatibus totam ex maiores dolorem
      facere veniam nostrum.
    </div>
  );
}
