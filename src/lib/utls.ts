import CryptoJs from "crypto-js";

export function encrypt<T>(data: T, key: string): string {
  return CryptoJs.AES.encrypt(JSON.stringify(data), key).toString();
}

export function decrypt<T>(data: string, key: string): T {
  return JSON.parse(
    CryptoJs.AES.decrypt(data, key).toString(CryptoJs.enc.Utf8)
  );
}

export function uint8ArrayToBase64(uint8Array: Uint8Array): string {
  // Process in chunks to avoid call stack overflow
  const chunkSize = 0x8000; // 32768 bytes
  const result: string[] = [];

  for (let i = 0; i < uint8Array.length; i += chunkSize) {
    const chunk = uint8Array.subarray(i, i + chunkSize);
    result.push(String.fromCharCode.apply(null, [...chunk]));
  }

  return btoa(result.join(""));
}

export function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const uint8Array = new Uint8Array(binaryString.length);

  for (let i = 0; i < binaryString.length; i++) {
    uint8Array[i] = binaryString.charCodeAt(i);
  }

  return uint8Array;
}
