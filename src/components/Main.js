import React from "react";
import classNames from "classnames";

const Main = ({ className, children }) => (
  <div className={classNames("main h-100", className)}>{children}</div>
);

export default Main;
