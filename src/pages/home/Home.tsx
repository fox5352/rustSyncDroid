import { Navigate } from "react-router-dom";
import { useSession } from "../../store/session";
import { Container, Typography } from "@mui/material";
import FileView from "./ui/FileView";

export default function Home() {
  const { data, loading } = useSession();


  if (loading) {
    return (
      <Typography variant="h4" component="h1">
        loading...
      </Typography>
    );
  }

  if (data == null) {
    return <Navigate to="/sync" />;
  }

  return (
    <Container
      maxWidth="md"
      component="section"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 1,
        width: "100%",
        p: 0
      }} id="testing"
    >
      <FileView
        title="Audios"
        type="audio"
      />
      <FileView
        title="Images"
        type="image"
      />
      <FileView
        title="Videos"
        type="video"
      />
    </Container>
  );
}
