import { webcrypto } from "node:crypto";
import { Buffer } from 'buffer';

const { subtle } = webcrypto;

export async function hashStringAsync(input) {
  // encode to binary format
  const encoded = new TextEncoder().encode(input);
  const buffer = await subtle.digest('SHA-256', encoded);
  return Buffer.from(buffer).toString('hex');
}