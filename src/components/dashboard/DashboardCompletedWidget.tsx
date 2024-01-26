import {ChevronRightIcon} from "@heroicons/react/24/outline";
import useDrivers from "../../api/drivers.ts";

const DashboardCompletedWidget = () => {
    const drivers = useDrivers("created_at");

    return (
      <ul
        role="list"
        className="divide-y divide-gray-100 overflow-hidden bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl"
      >
        <div className="border-b border-gray-200 bg-white px-4 py-4">
          <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
            <div className="ml-4 mt-2">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                abgeschlossene Weiterbildung
              </h3>
            </div>
          </div>
        </div>
        {drivers.data?.map(
          (driver: { id: string; user: { name: string; id: string } }, index:number) => (
            <li key={driver.id} className="relative flex justify-between gap-x-6 px-4 py-2 hover:bg-gray-50">
              <div className="flex gap-x-4">
                <div>{index + 1}</div>
                <div className="min-w-0 flex-auto">
                  <p className="text-sm font-semibold leading-6 text-gray-900">
                    <a href="#">
                      <span className="absolute inset-x-0 -top-px bottom-0" />
                      {driver.user.name}
                    </a>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-x-4">
                <ChevronRightIcon
                  className="h-5 w-5 flex-none text-gray-400"
                  aria-hidden="true"
                />
              </div>
            </li>
          )
        )}
      </ul>
    );
}

export default DashboardCompletedWidget;