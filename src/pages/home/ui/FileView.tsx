import { Box, CircularProgress, Divider, Typography } from "@mui/material";

import FolderBlock from "./FolderBlock";
import { useSession } from "../../../store/session";
import { useEffect, useMemo, useState } from "react";
import { FileData, getFiles } from "../../../lib/requests";

interface FileView {
  title: string;
  type: string;
}

interface FileView {
  title: string;
  type: string;
}

export default function FileView({ title, type }: FileView) {
  const { data: session } = useSession();

  const memoSession = useMemo(() => session, [session?.url, session?.token]);

  // page state
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState<{ message: string, error: "error" | "info" | "warnaing" } | null>(null);
  const [fileData, setFileData] = useState<any[] | null>(null);

  useEffect(() => {
    const fetchFileData = async () => {
      if (!memoSession) return;
      setIsError(null);
      setIsLoading(true);

      const [res, err] = await getFiles<FileData[]>(type, memoSession);

      if (err || !res) {
        setIsError({
          message: err ? err : "failed to get data",
          error: "error",
        });
        setIsLoading(false);
        return;
      }

      setFileData(res.data);
      setIsLoading(false);
      setIsError(null);
    };

    fetchFileData();
  }, [memoSession]);
  return (
    <Box sx={{
      mr: 2,
      p: 1.5,
      pr: 2,
    }}>
      <Typography variant="h5" component="h2">
        {title}
      </Typography>
      <Divider />
      {isError ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "223px",
          }}
        >
          <Typography
            variant="h4"
            color="error"
            sx={{ textAlign: "center", alignSelf: "center" }}
          >
            {isError.message}
          </Typography>
        </Box>
      ) : isLoading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "373px",
          }}
        >
          <CircularProgress
            sx={{ alignSelf: "center", mx: "auto" }}
            size={100}
          />
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "repeat(1, 1fr)", sm: "repeat(2, 1fr)" },
            gridAutoRows: "371px",
            gap: 1,
            height: "373px",
            overflowY: "auto",
            border: "1px solid black",
            borderRadius: "4px"
          }}
        >
          {fileData &&
            fileData.map((block, index) => (
              <FolderBlock key={index} folder={block.key} fileData={block} type={type} />
            ))}
        </Box>
      )}
    </Box>
  );
}
