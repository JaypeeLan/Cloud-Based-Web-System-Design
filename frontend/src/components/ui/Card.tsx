import { PropsWithChildren } from "react";

export const Card = ({ children }: PropsWithChildren) => {
  return <article className="card hover-lift">{children}</article>;
};
