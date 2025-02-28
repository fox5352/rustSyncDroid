import { writeFile, BaseDirectory } from "@tauri-apps/plugin-fs";
import { save } from "@tauri-apps/plugin-dialog";
import { FileTypeBuffer } from "./requests";

/**
 * Save a file with user-selected location using the system dialog
 */
export async function saveFileWithPicker(file: FileTypeBuffer) {
  try {
    const fileName = `${file.name}${file.extension}`;
    const fileBuffer = file.data?.data;

    if (!fileBuffer || fileBuffer === undefined) {
      throw new Error("File binary data not found: " + fileName);
    }

    // Open system save dialog to get user-selected path
    const savePath = await save({
      canCreateDirectories: true,
      title: "test",
      defaultPath: `${file.name}${file.extension}`,
      filters: [
        {
          name: `file`,
          extensions: [file.extension],
        },
        {
          name: "All Files",
          extensions: ["*"],
        },
      ],
    });

    // // If user canceled the dialog
    if (!savePath) throw new Error("user canceled save dialog");


    // // Save the file to the selected location
    await writeFile(savePath, fileBuffer, { create: true });

    return true
  } catch (error) {
    console.error("Failed to save file:", error);
    alert(
      `Error saving file: ${error instanceof Error ? error.message : String(error)
      }`
    );
    return false;
  }
}

/**
 * Fallback function to save to app's download directory if picker is not available
 */
export async function saveFileToDownloads(file: FileTypeBuffer) {
  try {
    const fileName = `${file.name}${file.extension}`;
    const fileBuffer = file.data?.data;

    if (!fileBuffer || fileBuffer === undefined) {
      throw new Error("File binary data not found: " + fileName);
    }

    const savePath = `/storage/emulated/0/Download/${fileName}`;

    // Save to the app's download directory
    await writeFile(savePath, fileBuffer, {
      baseDir: BaseDirectory.Download,
      create: true,
    });

    console.log(`File saved to downloads: ${fileName}`);
    return fileName;
  } catch (error) {
    console.error("Failed to save file to downloads:", error);
    alert(
      `Error saving file: ${error instanceof Error ? error.message : String(error)
      }`
    );
    throw error;
  }
}

/**
 * Main save function that tries the picker first, then falls back to downloads
 */
export async function saveFile(file: FileTypeBuffer) {
  try {
    // First try with file picker
    return await saveFileWithPicker(file);
  } catch (pickerError) {
    console.warn(
      "File picker failed, falling back to downloads directory:",
      pickerError
    );

    // Fall back to app's download directory
    return await saveFileToDownloads(file);
  }
}
