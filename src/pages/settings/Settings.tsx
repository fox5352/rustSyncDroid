import { Navigate } from "react-router-dom";
import { useSession } from "../../store/session";
import { Box, Button, Divider, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import { readFileWithPicker } from "../../lib/fileUtils";
import { useLoadingState } from "../../ui/LoadingModel";
import { postFile } from "../../lib/requests";

export default function Setttings() {
  const { toggleLoadingState } = useLoadingState();

  const { data } = useSession();

  if (data == null) {
    return <Navigate to="/sync" />;
  }

  const handleAddFile = async () => {
    if (data == null) return;

    try {
      toggleLoadingState();

      const file = await readFileWithPicker();

      if (!file) {
        alert("Failed to read file");
        toggleLoadingState();
        return;
      }

      const [res, error] = await postFile(file.type.split("/")[0], file, data)

      if (error) {
        alert(error);
        return;
      }

      if (res) alert("successfully uploaded file");

    } catch (error) {
      alert(`Error reading file: ${error instanceof Error ? error.message : String(error)}`);
      return;
    } finally {
      toggleLoadingState();
    }
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" component="h1">Settings</Typography>
      <Divider />
      {/* TODO: temp location */}
      <Box sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: 2,
        padding: 2,
      }}>
        <Typography variant="body1">
          Upload file
        </Typography>
        <Button variant="contained" onClick={handleAddFile} ><Add /></Button>
      </Box>
    </Box>
  )
}
