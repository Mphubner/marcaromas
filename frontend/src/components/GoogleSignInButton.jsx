import React from 'react';
import { GoogleLogin } from '@react-oauth/google';

export default function GoogleSignInButton({ onSuccess, onError }) {
  return (
    <GoogleLogin
      onSuccess={onSuccess}
      onError={onError}
      useOneTap
    />
  );
}
