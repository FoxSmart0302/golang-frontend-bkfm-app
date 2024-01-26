import { useEffect } from "react";
import {useState} from "react";
import {Disclosure} from "@headlessui/react";

import {MinusSmallIcon, PlusSmallIcon} from "@heroicons/react/20/solid";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Input from "../../../components/inputs/Input";
import Panel from "../../../components/Panel";
import { toastr } from "../../../components/utils/toastr";
import api from "../../../api/api";
import Select from "../../../components/inputs/Select";
import { localStorageUserInfo, isEmpty, isValidEmail, modules, areasOfKnowledge } from "../../../components/utils";
import DriversForm, { Driver } from "./DriversForm";

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

const DriversEditPage = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
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
        const data = res.data.data;
        setDriver(data);
        setCompany({id: data.school_company.id, name: data.school_company.name});

        console.log("driver_one_show:", data.school_company_id, data.school_company_name);
      }
      fetchData();
    }, [id, companies]);
    const handleUpdate= () => {  
      console.log("drivercreate:", driver);
      if(!driver.name || !driver.birth_name || !driver.birth_date || !driver.module95 || !driver.birth_place || !driver.doctor_type || !driver.gender || !driver.email || !driver.driving_license){
          return toastr.warning("Bitte einen Wert eingeben"); 
      }
      if(!isValidEmail(driver.email)){
        return toastr.warning("Falsche E-Mail Adresse");
      }
      if (!company?.id) {
        driver.school_company_id = ""; // Replace "default_value" with the actual default value you want to use
      } else {
        driver.school_company_id = company.id;
        driver.school_company_name = company.name;
        driver.user_id = user_id;
      }
    
      update.mutate();
    };
    const handleCancel = () => {
      navigate(`/manager/drivers/${id}`)
    }
    const update = useMutation({
      mutationFn: async () => {
      const res = await api.post(`/api/v1/manager/drivers/update/${id}`, driver);
      const  data = res.data.data;
      return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["drivers"] }).then((result) => {
          toastr.success("Erfolgreich aktualisiert");
          console.log("driver_update_result:", result)
          navigate("/manager/drivers");
        });
      },
      onError: (err) => {
        console.log("create_database_error:", err);
        toastr.warning("Bitte versuchen Sie es später noch einmal");
      },
    });

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
    if (!companies.isSuccess) return <div>Loading...</div>;
    
    // const options = [
    //     {
    //         name: 'Wade Cooper',
    //         id: 'wade-cooper',
    //         imageUrl: 'https://placehold.co/128',
    //     },
    //     {
    //         name: 'Wade Cooper2',
    //         id: 'wade-cooper2',
    //         imageUrl: 'https://placehold.co/128',
    //     },
    // ]
    

    return (
      <div className="divide-y divide-gray-900/10">
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3 pb-4">
          <div className="px-4 sm:px-0">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Allgemein
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600"></p>
          </div>
          <Panel>
            {/* <ComboBox
              label="Unternehmen"
              options={options}
              onChanged={(value) => console.log(value)}
            /> */}
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
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3 py-4">
          <div className="px-4 sm:px-0">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Personendaten
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600"></p>
          </div>
          <div className="w-full col-span-2 space-y-4">
            <DriversForm
              onChange={(value) => {
                setDriver(value);
              }}
              value={driver}
              key={0}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3 py-4">
          <div className="px-4 sm:px-0">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Kenntnisbereiche
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600"></p>
          </div>
          <div className="w-full col-span-2 space-y-4">
            <fieldset>
              <dl className="divide-y divide-gray-200 grid grid-cols-1 gap-2">
                {modules.map((faq) => (
                  <Disclosure
                    as="div"
                    key={faq.id}
                    className="bg-white rounded-xl shadow"
                  >
                    {({ open }) => (
                      <>
                        <dt>
                          <Disclosure.Button className="flex w-full items-center justify-between px-4 py-3 text-left">
                            <div className="flex items-center">
                              <span className="text-lg font-medium text-gray-900">
                                {faq.id} - {faq.name}
                              </span>
                            </div>
                            <div className="flex items-center">
                              {open ? (
                                <MinusSmallIcon
                                  className="h-6 w-6 text-gray-400"
                                  aria-hidden="true"
                                />
                              ) : (
                                <PlusSmallIcon
                                  className="h-6 w-6 text-gray-400"
                                  aria-hidden="true"
                                />
                              )}
                              <input
                                id={`person-${faq.id}`}
                                name={`person-${faq.id}`}
                                type="checkbox"
                                className="ml-3 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                              />
                            </div>
                          </Disclosure.Button>
                        </dt>
                        <Disclosure.Panel as="dd" className="px-4 pb-3">
                          <ul className="space-y-2">
                            {faq.knowledgeAreas &&
                              faq.knowledgeAreas.map((category) => (
                                <li
                                  key={category}
                                  className="flex justify-between items-center"
                                >
                                  <span className="text-gray-600">
                                    {category} - {areasOfKnowledge[category]}
                                  </span>
                                  <input
                                    type="checkbox"
                                    className="ml-3 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                  />
                                </li>
                              ))}
                          </ul>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                ))}
              </dl>
            </fieldset>
          </div>
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
          <button
            className="block rounded-md bg-indigo-600 ml-2 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() => {
              handleUpdate();
            }}
          >
            💾 Speichern
          </button>
        </div>
      </div>
    );
}

export default DriversEditPage;