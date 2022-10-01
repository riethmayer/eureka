import React from "react";
import {
  authenticateWebAuthn,
  authenticateWebAuthnStart,
} from "@lib/webAuthnUtils";
import * as webAuthenticationJson from "@github/webauthn-json";
import { useRouter } from "next/router";

function WebAuthenticationAuthenticateButton() {
  const router = useRouter();
  const authenticate = async () => {
    const options = await authenticateWebAuthnStart();
    const credential = await webAuthenticationJson.get({
      publicKey: JSON.parse(options),
    });
    await authenticateWebAuthn(JSON.stringify(credential));
    router.push("./profile");
  };
  return (
    <button className="primaryButton" onClick={authenticate}>
      Authenticate
    </button>
  );
}

export default WebAuthenticationAuthenticateButton;
