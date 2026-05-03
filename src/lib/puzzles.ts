import CryptoJS from "crypto-js";

const A_CODE = "A".charCodeAt(0);

export function caesarDecrypt(text: string, shift: number) {
  return text
    .toUpperCase()
    .split("")
    .map((char) => {
      const code = char.charCodeAt(0);
      if (code < 65 || code > 90) {
        return char;
      }
      return String.fromCharCode(((code - A_CODE - shift + 26) % 26) + A_CODE);
    })
    .join("");
}

export function modInverse(a: number, m: number): number | null {
  const normalized = ((a % m) + m) % m;
  for (let x = 1; x < m; x += 1) {
    if ((normalized * x) % m === 1) {
      return x;
    }
  }
  return null;
}

export function bruteForceAttempts(password: string): number | null {
  const parsed = Number(password);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return null;
  }
  return parsed + 1;
}

export function hashMessage(message: string) {
  return CryptoJS.SHA256(message).toString();
}

export function signMessage(message: string, privateKey: string) {
  return hashMessage(`${message}::${privateKey}`);
}

export function derivePublicKey(privateKey: string) {
  return hashMessage(privateKey).slice(0, 16).toUpperCase();
}

export function verifySignature(
  message: string,
  signature: string,
  privateKey: string
) {
  return signMessage(message, privateKey) === signature;
}
