"use client"
import { Button } from "./ui/button";
import { experimental_useFormStatus as useFormStatus } from "react-dom";
import { ButtonLoading } from "./ui/button-loading";

export function SubmitButton({}) {
  const {pending} = useFormStatus();
  if(pending) return <ButtonLoading text="Submitting" />;
  return <Button type="submit" disabled={pending}>Submit</Button>;
}
  