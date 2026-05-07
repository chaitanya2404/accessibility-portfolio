import { DepartmentPage } from "../_components/DepartmentPage";
import { departments } from "../data";

export const metadata = {
  title: "Procurement — Division Hub",
  description: departments.procurement.shortDescription,
};

export default function ProcurementPage() {
  return <DepartmentPage department={departments.procurement} />;
}
