import { isSignatureValid } from "@/lib/signature";
import { signatureValidateResponseSchema } from "@/schemas/signature";

describe("isSignatureValid", () => {
  it("returns false when meta is null", () => {
    expect(isSignatureValid(null)).toBe(false);
  });

  it("returns false when status is DENIED", () => {
    expect(
      isSignatureValid({
        id: "1",
        status: "DENIED",
        expiration: "2099-12-31",
      }),
    ).toBe(false);
  });

  it("returns true when ALLOWED and not expired", () => {
    const future = new Date();
    future.setFullYear(future.getFullYear() + 1);
    const expiration = future.toISOString().slice(0, 10);

    expect(
      isSignatureValid({
        id: "1",
        status: "ALLOWED",
        expiration,
      }),
    ).toBe(true);
  });

  it("returns false when expiration is in the past", () => {
    expect(
      isSignatureValid({
        id: "1",
        status: "ALLOWED",
        expiration: "2000-01-01",
      }),
    ).toBe(false);
  });
});

describe("signatureValidateResponseSchema", () => {
  it("parses a valid validate response", () => {
    const data = {
      message: "Token found on system index. Signature allowed.",
      signature: {
        id: "uuid",
        status: "ALLOWED",
        expiration: "2026-06-17",
        ip_address: "127.0.0.1",
      },
    };
    expect(signatureValidateResponseSchema.parse(data)).toEqual(data);
  });
});
