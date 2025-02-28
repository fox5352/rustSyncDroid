import { Navigate } from "react-router-dom";
import { useSession } from "../../store/session";
import { Container, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { FileData, getFiles, getSettings, Settings } from "../../lib/requests";
import FileView from "./ui/FileView";

export default function Home() {
  const { data, loading } = useSession();

  // const [pageState, setPageState] = useState<any>({
  //   isImagesLoading: false,
  //   isImagesError: null,
  //   images: null,
  //   isAudiosLoading: false,
  //   isAudiosError: null,
  //   audios: null,
  //   isVideosLoading: false,
  //   isVideosError: null,
  //   videos: null,
  // });
  //
  // if (loading) {
  //   return (
  //     <Typography variant="h4" component="h1">
  //       loading...
  //     </Typography>
  //   );
  // }
  //
  // if (data == null) {
  //   return <Navigate to="/sync" />;
  // }
  //
  // // TODO: add fetching of data from api using the session data
  //
  // const manageStateFromData = async (allowList: string[]) => {
  //   for (const fileType of allowList) {
  //     const [res, error] = await getFiles<FileData[]>(fileType, {
  //       url: data.url,
  //       token: data.token,
  //     });
  //
  //     const capitalizeFirstLetter = (str: string) =>
  //       str.charAt(0).toUpperCase() + str.slice(1);
  //
  //     const block = `${capitalizeFirstLetter(fileType)}s`;
  //
  //     if (error || !res) {
  //       setPageState((prev: any) => ({
  //         ...prev,
  //         [`is${block}Error`]: {
  //           message: error,
  //           colorCode: "error",
  //         },
  //         [`is${block}Loading`]: false,
  //       }));
  //       continue;
  //     }
  //
  //     const { data: fileDataArray } = res;
  //
  //     setPageState((prev: any) => ({
  //       ...prev,
  //       [`is${block}Loading`]: false,
  //       [`is${block}Error`]: null,
  //       [`${block.toLowerCase()}`]: fileDataArray,
  //     }));
  //   }
  // };
  //
  // useEffect(() => {
  //   (async () => {
  //
  //     setPageState((prev: any) => ({
  //       ...prev,
  //       isImagesLoading: true,
  //       isImagesError: null,
  //       isAudiosLoading: true,
  //       isAudiosError: null,
  //       isVideosLoading: true,
  //       isVideosError: null,
  //     }));
  //
  //     let { allowList }: Settings = await getSettings(data);
  //
  //     if (!allowList) {
  //       // TODO: add a way to give hole page error
  //       return;
  //     }
  //
  //     await manageStateFromData(allowList);
  //   })();
  // }, []);

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
