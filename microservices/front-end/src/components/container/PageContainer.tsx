import React, { FC, ReactNode } from "react";
import { Helmet } from "react-helmet";

interface PageContainerProps {
  title: string;
  description: string;
  children: ReactNode;
}

const PageContainer: FC<PageContainerProps> = ({
  title,
  description,
  children,
}) => (
  <div>
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Helmet>
    {children}
  </div>
);

export default PageContainer;
