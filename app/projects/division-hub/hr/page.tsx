import { DepartmentPage } from "../_components/DepartmentPage";
import { departments } from "../data";

export const metadata = {
  title: "Human Resources — Division Hub",
  description: departments.hr.shortDescription,
};

export default function HRPage() {
  return <DepartmentPage department={departments.hr} />;
}
