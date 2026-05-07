import { DepartmentPage } from "../_components/DepartmentPage";
import { departments } from "../data";

export const revalidate = 60;

export const metadata = {
  title: "Facilities — Division Hub",
  description: departments.facilities.shortDescription,
};

export default function FacilitiesPage() {
  return <DepartmentPage department={departments.facilities} />;
}
