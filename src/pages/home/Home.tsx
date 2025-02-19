import { Navigate } from "react-router-dom";
import { useSession } from "../../store/session";
import { Typography } from "@mui/material";

export default function Home() {
  const { data, loading } = useSession();

  if (loading) {
    return (
      <Typography variant="h4" component="h1">loading...</Typography>
    )
  }

  if (data == null) {
    return <Navigate to="/sync" />;
  }

  // TODO: add fetching of data from api using the session data

  return (
    <div>
      <Typography variant="h5" component="h2">{data.url}</Typography>
      <Typography variant="body1">Token: {data.token}</Typography>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit numquam
      architecto doloribus est, voluptatem magni temporibus consequatur
      molestias, pariatur odit quas rem, voluptatibus totam ex maiores dolorem
      facere veniam nostrum.
    </div>
  );
}
