import { Navigate } from "react-router-dom";
import { useSession } from "../../store/session";
import { Box, Button, Divider, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import { filePicker, getFileStats, readFileBuffer } from "../../lib/fileUtils";
import { useLoadingState } from "../../ui/LoadingModel";
import {
  connectTOSocket,
  FileDataType,
  uploadPacket,
} from "../../lib/requests";
import { uint8ArrayToBase64 } from "../../lib/utls";

export default function Setttings() {
  const { toggleLoadingState, updateLoadingText, updateLoadingAmount } =
    useLoadingState();

  const { data } = useSession();

  if (data == null) {
    return <Navigate to="/sync" />;
  }

  const handleAddFile = async () => {
    if (data == null) return;

    try {
      const uri = await filePicker();

      const stats = await getFileStats(uri);

      toggleLoadingState();

      let counter = 0;
      const packetSize = Math.floor(0.6 * 1024 * 1024); // 600KB

      const socket = connectTOSocket(data.url);

      await readFileBuffer(uri, async (buffer, totalSize) => {
        let packet: FileDataType = {
          id: "",
          name: stats.name,
          type: stats.mime_type,
          data: uint8ArrayToBase64(buffer),
          packetIndex: counter,
        };

        await uploadPacket(socket, data.token, packet, 10_000);

        let loadingText = "Loading";

        const amount = totalSize
          ? Math.floor(
              (Math.floor(packetSize * (counter + 1)) / totalSize) * 100
            )
          : null;

        if (totalSize) {
          loadingText = `${amount}%`;
        } else {
          loadingText = `${Math.floor(packetSize * (counter + 1))}KB`;
        }

        updateLoadingText(`UPLOAD ${loadingText}`);

        if (amount) updateLoadingAmount(amount);

        counter++;
      });
    } catch (error) {
      alert(
        `Error reading file: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    } finally {
      toggleLoadingState();
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" component="h1">
        Settings
      </Typography>
      <Divider />
      {/* TODO: temp location */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderRadius: 2,
          padding: 2,
        }}
      >
        <Typography variant="body1">Upload file</Typography>
        <Button variant="contained" onClick={handleAddFile}>
          <Add />
        </Button>
      </Box>
    </Box>
  );
}
