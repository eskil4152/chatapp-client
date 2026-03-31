"use client";

import React from "react";
import PasswordStrengthBarModule from "react-password-strength-bar";

type Props = {
  password: string;
  onChangeScore?: (score: number) => void;
  minLength?: number;
  scoreWords?: string[];
  shortScoreWord?: string;
  className?: string;
};

const RawPasswordStrengthBar =
  PasswordStrengthBarModule as unknown as React.ComponentType<Props>;

export default function PasswordStrength(props: Props) {
  return <RawPasswordStrengthBar {...props} />;
}
