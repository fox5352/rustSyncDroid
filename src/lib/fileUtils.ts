import { invoke } from "@tauri-apps/api/core";
import { FileHandle, open, SeekMode } from "@tauri-apps/plugin-fs";

import { FileTypeBuffer } from "./requests";

/**
 * Save a file with user-selected location using the system dialog
 */
export async function saveFileWithPicker(
  file: FileTypeBuffer,
  mime_type: string
) {
  try {
    const fileName = `${file.name}${file.extension}`;
    const fileBuffer = file.data?.data;

    if (!fileBuffer || fileBuffer === undefined) {
      throw new Error("File binary data not found: " + fileName);
    }

    const res = await invoke<string>("write_to_file_with_picker", {
      data: {
        file_name: fileName,
        mime_type,
        content: Array.from(fileBuffer),
      },
    });

    alert(res);
    return true;
  } catch (error) {
    alert(
      `Error saving file: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    return false;
  }
}

export async function readFileWithPicker(): Promise<{
  name: string;
  type: string;
  data: Uint8Array;
} | null> {
  try {
    const res = await invoke<{
      file_name: string;
      mime_type: string;
      content: Uint8Array;
    }>("read_file_with_picker");

    const lastDot = res.file_name.lastIndexOf(".");

    const name = res.file_name.substring(0, lastDot);
    const ext = res.file_name.substring(lastDot + 1);

    const type = `${res.mime_type.split("/")[0]}/${ext}`;

    return {
      name,
      type,
      data: res.content,
    };
  } catch (error) {
    alert(
      `Error saving file: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    return null;
  }
}

export async function filePicker(): Promise<string> {
  return await invoke<string>("file_picker");
}

export async function getFileStats(uri: string): Promise<{
  name: string;
  mime_type: string;
}> {
  return await invoke("get_file_stats", { path: uri });
}

/**
 * Reads a file in chunks and calls the provided function with the buffer for each chunk.
 * The file is read in chunks of `jumpSize` bytes at a time, and the function is called with
 * the current chunk of data. The function is called with the following signature:
 * `func(buffer: Uint8Array) => void`
 * @param uri The path to the file to read
 * @param func The function to call with each chunk of data
 */
export async function readFileBuffer(
  uri: string,
  func: (buffer: Uint8Array, totalSize?: number) => Promise<void>
) {
  let fileHandle: FileHandle | null = null;
  try {
    fileHandle = await open(uri, { read: true });

    const fileStats = await fileHandle.stat();
    const chunkSize = Math.floor(0.6 * 1024 * 1024); // 600KB in bytes

    let offset = 0;

    while (offset < fileStats.size) {
      await fileHandle.seek(offset, SeekMode.Start);

      const chunk = new Uint8Array(chunkSize);
      const bytesRead = await fileHandle.read(chunk);

      if (bytesRead === null || bytesRead === 0) break; // EOF or no more data

      await func(chunk.subarray(0, bytesRead), fileStats.size); // Send only the actual read bytes

      offset += bytesRead; // Move forward
    }
  } catch (error) {
    console.error("Error reading file:", error);
  } finally {
    if (fileHandle) await fileHandle.close();
  }
}
