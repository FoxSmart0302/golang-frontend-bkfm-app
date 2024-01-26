import {ChevronRightIcon} from "@heroicons/react/24/outline";
import ButtonPanel from "./ButtonPanel.tsx";
import DashboardChart from "../../components/dashboard/DashboardChart.tsx";
import DashboardNewDriversWidget from "../../components/dashboard/DashboardNewDriversWidget.tsx";
import DashboardNextFurtherWidget from "../../components/dashboard/DashboardNextFurther.tsx";
import DashboardModule95Widget from "../../components/dashboard/DashboardModule95Widget.tsx";
import DashboardCompletedWidget from "../../components/dashboard/DashboardCompletedWidget.tsx";

const DashboardPage = () => {

    return (
      <>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid grid-cols-3 gap-4 col-span-2">
            <div className="col-span-2 divide-y divide-gray-100 overflow-hidden bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
              <DashboardChart />
            </div>

            <ButtonPanel />
          </div>
          <DashboardNewDriversWidget />
          <DashboardNextFurtherWidget />
          <DashboardModule95Widget />
          <DashboardCompletedWidget />
        </div>
      </>
    );
}

export default DashboardPage
