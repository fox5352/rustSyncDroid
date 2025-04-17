import { io, Socket } from "socket.io-client";

import { Session } from "../store/session";
import { decrypt, encrypt } from "./utls";

export type AllowLst = {
  allowList: string[];
};
export type ImagePaths = {
  imagePaths: string[];
};
export type AudioPaths = {
  audioPaths: string[];
};

export type VideoPaths = {
  videoPaths: string[];
};

export type ImageExt = {
  imageExt: string[];
};
export type AudioExt = {
  audioExt: string[];
};

export type VideoExt = {
  videoExt: string[];
};

export type Server = {
  server: {
    host: string;
    port: number;
  };
};

export type Settings = AllowLst &
  ImagePaths &
  AudioPaths &
  VideoPaths &
  ImageExt &
  AudioExt &
  VideoExt &
  Server;

export type SettingsKeys =
  | "allowList"
  | "imagePaths"
  | "audioPaths"
  | "videoPaths"
  | "imageExt"
  | "audioExt"
  | "videoExt"
  | "server";

type AudioMetaData = {
  duration: number;
  sampleRate: number;
};

type ImageMetaData = {
  thumbnail: {
    data: number[];
    type: string;
  };
};

export type FileType = {
  name: string;
  path: string;
  extension: string;
  type: string;
  metadata: {
    size: number;
    created: string;
    modified: string;
    type: string;
    imageMetaData?: ImageMetaData;
    audioMetaData?: AudioMetaData;
  };
};

/**
 * Perform a request to the backend.
 *
 * @param url The URL path of the request
 * @param method The HTTP method of the request
 * @param body The body of the request. Must be defined for POST requests.
 *
 * @returns A promise that resolves to the response object
 *
 * @throws If getSessionData() fails
 * @throws If the request method is POST and no body is given
 */
async function request<T>(
  url: string,
  method: "GET" | "POST" | "PUT",
  session: Session,
  body?: string
): Promise<T> {
  if (method == "POST" && (body == undefined || body == null))
    throw new Error("Can't do a post request without a body");

  const headers = new Headers();
  headers.append("Authorization", session.token);
  headers.append("Content-Type", "application/json");

  let options = {
    method,
    headers,
    body: body
      ? JSON.stringify({
          encryptedData: encrypt(body, session.token),
        })
      : undefined,
  };

  const res = await fetch(`${session.url}/${url}`, options);

  const data = decrypt(await res.json(), session.token);
  return data as T;
}

export async function getSettings(session: Session): Promise<Settings> {
  const data = await request<{ data: { settings: Settings } }>(
    "api/settings",
    "GET",
    session
  );
  return data.data.settings as Settings;
}

export async function updateSettings(
  updateData: unknown,
  rvop: boolean = false,
  session: Session
) {
  const data = JSON.stringify({ settings: updateData });

  const res = await request<{ data: { settings: Settings } }>(
    "api/settings",
    "POST",
    session,
    data
  );

  if (rvop) {
    const newSettings = res;

    return newSettings.data.settings;
  } else {
    return null;
  }
}

export interface File {
  name: string;
  path: string;
  extension: string;
}

export interface Folder {
  [key: string]: File[];
}

export interface FileData {
  key: string;
  folder: Folder;
}

export async function getFiles<T>(
  type: string,
  session: Session
): Promise<[{ data: T; message: string } | null, string | null]> {
  const data = await request<T>(`api/${type}`, "GET", session);

  return [data as { data: T; message: string }, null];
}

export type FileTypeBuffer = FileType & {
  data?: {
    type?: "Buffer";
    data?: Uint8Array;
  };
};

export async function getFile(
  type: string,
  fileData: { name: string; path: string },
  session: Session
): Promise<[FileTypeBuffer | null, string | null]> {
  const encodedName = encodeURIComponent(fileData.name);
  const encodedPath = encodeURIComponent(fileData.path);

  const url = `api/${type}/file?name=${encodedName}&path=${encodedPath}`;
  const res = await request<{ data: FileTypeBuffer }>(url, "GET", session);

  const data = res.data;

  return [data, null];
}

export async function postFile(
  type: string,
  fileData: {
    name: string;
    type: string;
    data: Uint8Array;
  },
  session: Session
): Promise<[boolean, string | null]> {
  const url = `api/${type}`;

  await request(url, "POST", session, JSON.stringify(fileData));

  return [true, null];
}

// TODO: add a websocket function here
export interface FileDataType {
  id?: string;
  name: string;
  type: string;
  path?: string;
  data: string;
  packetIndex: number;
}

type PacketEvent = "UPLOAD" | "UPLOAD_COMPLETE";

export interface SendPacket<T> {
  type: PacketEvent;
  data: T;
}

export function testWebSocketConnection(
  url: string,
  timeout = 5000
): Promise<any> {
  const socket = io(url, { reconnection: false }); // Disable auto-reconnect for testing

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      socket.disconnect();
      reject(new Error("Connection timed out"));
    }, timeout);

    socket.on("connect", () => {
      clearTimeout(timer); // Clear timeout if connected
      resolve("success");
    });

    socket.on("connect_error", (error) => {
      clearTimeout(timer);
      reject(new Error(`Connection failed: ${error.message || error}`));
    });

    socket.on("disconnect", () => {
      clearTimeout(timer);
      reject(new Error("Socket disconnected"));
    });

    socket.on("error", (error) => {
      clearTimeout(timer);
      reject(new Error(`Socket error: ${error.message || error}`));
    });
  });
}

export function connectTOSocket(url: string) {
  return io(url);
}

//  TODO: handle encryption later------------------------------------------------------------------------------------------------------------------------------------------------

export type PacketObj<T = any> = {
  data: T;
} & Record<string, any>;

export async function uploadPacket(socket: Socket, token: string, obj: any) {
  socket.emit("UPLOAD", JSON.stringify({ ...obj, data: obj.data }));
}

export async function sendPacket<T>(socket: Socket, packet: SendPacket<T>) {
  socket.emit(packet.type, JSON.stringify(packet.data));
}

export interface ReivePacket<T> {
  type: PacketEvent;
  condition: (data: T) => boolean;
  callback: (data: T) => void;
}

export async function getPacket<T>(socket: Socket, packet: ReivePacket<T>) {
  socket.on(packet.type, (obj: PacketObj<T>) => {
    if (packet.condition(obj.data)) {
      packet.callback(obj.data);
    }
  });
}
