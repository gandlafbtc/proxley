export function hexToUint8Array(hexString: string): Uint8Array {
  /* Remove '0x' prefix if present */
  hexString = hexString.replace("0x", "");
  /* Ensure even number of characters */
  if (hexString.length % 2 !== 0) {
    hexString = "0" + hexString;
  }
  const bytes = new Uint8Array(hexString.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hexString.substr(i * 2, 2), 16);
  }
  return bytes;
}
