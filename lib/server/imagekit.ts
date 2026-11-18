import "server-only";
import { createHmac, randomUUID } from "node:crypto";

/**
 * Short-lived signature that lets the admin's browser upload ONE file straight
 * to ImageKit. The private key never leaves the server.
 * https://imagekit.io/docs/api-reference/upload-file/upload-file#how-to-implement-client-side-file-upload
 */
export function getImageKitUploadAuth() {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
  if (!privateKey || !publicKey) throw new Error("ImageKit keys are not configured");
  const token = randomUUID();
  const expire = Math.floor(Date.now() / 1000) + 20 * 60; // must be < 1 hour ahead
  const signature = createHmac("sha1", privateKey).update(token + expire).digest("hex");
  return { token, expire, signature, publicKey };
}
