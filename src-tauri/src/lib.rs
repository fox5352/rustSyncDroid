use std::io::Write;

use serde::{Deserialize, Serialize};
// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use tauri_plugin_android_fs::{self, AndroidFs, AndroidFsExt};

#[derive(Serialize, Deserialize, Debug)]
struct FileData {
    file_name: String,
    mime_type: String,
    content: Vec<u8>,
}

#[tauri::command]
fn write_to_file_with_picker(app: tauri::AppHandle, data: FileData) -> Result<String, String> {
    let api = app.android_fs();
    let selected_path = api
        .show_save_file_dialog(data.file_name, Some(&data.mime_type))
        .map_err(|_| String::from("failed to get paths from save dialog"))?;

    if let Some(path) = selected_path {
        let mut file = api.create_file(&path).map_err(|_| {
            String::from("failed create file handle in the write_to_file_with_picker")
        })?;

        file.write_all(&data.content)
            .map_err(|_| String::from("failed to write file"))?;

        return Ok(String::from("successfully saved file"));
    } else {
        return Ok(String::from("CANCELED"));
    }
}

#[tauri::command]
fn write_to_downloads(_app: tauri::AppHandle, _data: FileData) -> Result<String, String> {
    return Err("not yet impl".to_string());
}

#[tauri::command]
fn read_file_with_picker(app: tauri::AppHandle) -> Result<FileData, String> {
    let api = app.android_fs();

    let paths = api
        .show_open_file_dialog(&["*/*"], false)
        .map_err(|err| format!("failed to open file dialog: {}", err))?;

    if paths.is_empty() {
        return Err("file not selected".to_string());
    }

    if let Some(selected_path) = paths.iter().next() {
        let file_name = api
            .get_file_name(&selected_path)
            .map_err(|err| format!("failed to get file name: {}", err))?;
        let mime_type = api
            .get_mime_type(&selected_path)
            .map_err(|err| format!("failed to get mime type: {}", err))?;
        let content = api
            .read(&selected_path)
            .map_err(|err| format!("failed to read file: {}", err))?;

        return Ok(FileData {
            file_name,
            mime_type,
            content,
        });
    } else {
        return Err("file not selected".to_string());
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_android_fs::init())
        .plugin(tauri_plugin_sql::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_barcode_scanner::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            write_to_file_with_picker,
            write_to_downloads,
            read_file_with_picker
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
