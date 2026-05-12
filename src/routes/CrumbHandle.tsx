import type { Params } from "react-router-dom";

export interface CrumbHandle {
  // La fonction crumb peut prendre les données du loader en argument
  crumb: (data?: any, params?: Params) => React.ReactNode;
}
