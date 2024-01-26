import { useEffect } from "react";
import {useState} from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Input from "../../../components/inputs/Input";
import Panel from "../../../components/Panel";
import api from "../../../api/api";
import Select from "../../../components/inputs/Select";
import { localStorageUserInfo, isEmpty } from "../../../components/utils";
import DriversForm, { Driver } from "./DriversForm";
import DriversCompleteModule from "./DriversCompleteModule";
import DriversPlanModule from "./DriversPlanModule";
import CarImg from '../../../assets/truck_example.jpg';

const emptyDriver: Driver = {
    name: '',
    birth_name: '',
    birth_date: '',
    module95: '',
    birth_place: '',
    doctor_type: '',
    gender: '',
    email: '',
    school_company_id: '',
    user_id: '',
    driving_license: 'C',
    school_company_name: '',
}

type CompanyType = {
  name: string;
  id: null | string;
};

const initialCompanyForm = {
  name: "",
  id: null,
};

const DriversShowPage = () => {
    const navigate = useNavigate();
    // eslint-disable-next-line prefer-const
    let companies;
    const {id} = useParams();
    const [company, setCompany] = useState<CompanyType>(initialCompanyForm);
    const [driver, setDriver] = useState<Driver>(emptyDriver);
    const { user_id } = localStorageUserInfo();
    useEffect(() => {
      if (isEmpty(user_id)) {
        window.localStorage.clear();
        return navigate("/login");
      }
    }, [company, navigate, user_id]);

    useEffect(() => {
      async function fetchData() {
        const res = await api.get(`/api/v1/manager/drivers/${id}`);
        const data = await res.data.data;
        setDriver(data);
        setCompany({id: data.school_company.id, name: data.school_company.name});

        console.log("driver_one_show:", data.school_company_id, data.school_company_name);
      }
      fetchData();
    }, [id, companies]);
   
    // eslint-disable-next-line prefer-const
    companies = useQuery<
        Array<{
            id: string;
            name: string;
        }>
    >({
        queryKey: ["companies"],
        queryFn: async () => {
            const res = await api.get("/api/v1/companies");
            if(!company.id){
                setCompany((data) => {
                    return {
                        ...data,
                        id: res.data.data[0].id,
                        name: res.data.data[0].name
                    }
                })
            }
            return res.data.data;
        },
    });
    if (!companies.isSuccess || !company.name) return <div>Loading...</div>;
    
    const handleCancel = () => {
      navigate('/manager/drivers/');
    } 
    
    return (
      <div className="divide-y divide-gray-900/10">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Kraftfahrer
            </h1>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 flex">
            <button
              type="button"
              onClick={() => navigate(`/manager/drivers/edit/${id}`)}
              className="block rounded-md pencil-button px-3 py-2 text-center text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              bearbeiten
            </button>
            <button
              type="button"
              onClick={() => navigate("/manager/drivers/createone")}
              className="block rounded-md module-button px-3 py-2 text-center text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ml-2"
            >
              Module anzeigen
            </button>
            <NavLink
              target="_blank"
              to={`/manager/drivers/${id}/pdf`}
              className="block rounded-md print-button px-3 py-2 text-center text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ml-2"
            >
              drucken
            </NavLink>
          </div>
        </div>
        <div className="drivers-show-subcontainer mt-4 gap-4 grid grid-cols-2">
          <div className="grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3 py-4">
            <div className="px-4 sm:px-0">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Allgemein
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600"></p>
            </div>
            <Panel>
              <div>
                <img
                  src={CarImg}
                  alt=""
                  className="mx-auto"
                  style={{ width: "44.5%" }}
                />
              </div>
              <Select
                name={"school_company_id"}
                label={"Unternehmen"}
                options={companies.data}
                value={
                  companies.data.find((data) => data.id === company.id) ||
                  companies.data[0]
                }
                onChange={(value) =>
                  setCompany((data) => {
                    return { ...data, id: value.id, name: value.name };
                  })
                }
              />
              <Input
                name="id"
                label="Sachbearbeiterkennung"
                type="text"
                value="Anton Jacker"
                disabled={true}
              />
            </Panel>
          </div>
          <div className="grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3 py-4">
            <div className="px-4 sm:px-0">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Personendaten
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600"></p>
            </div>
            <div className="w-full col-span-2 space-y-4">
              <DriversForm
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                onChange={() => {}}
                value={driver}
                key={0}
              />
            </div>
          </div>
        </div>
        <div className="drivers-show-subcontainer py-3 gap-4 grid grid-cols-2">
          <DriversCompleteModule />
          <DriversPlanModule />
        </div>
        <div className="col-span-2 flex justify-end pt-3">
          <button
            className="rounded-md delete-button px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() => {
              handleCancel();
            }}
          >
            👈 Stornieren
          </button>
        </div>
      </div>
    );
}

export default DriversShowPage;