import { useEffect } from "react";
import {useState} from "react";
import {Disclosure} from "@headlessui/react";

import {MinusSmallIcon, PlusSmallIcon} from "@heroicons/react/20/solid";
import { useNavigate } from "react-router-dom";
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

const DriversOneCreatePage = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [company, setCompany] = useState<CompanyType>(initialCompanyForm);
    const [drivers, setDrivers] = useState<Driver[]>([emptyDriver]);
    const { user_id } = localStorageUserInfo();
    useEffect(() => {
      if (isEmpty(user_id)) {
        window.localStorage.clear();
        return navigate("/login");
      }
    }, [company, navigate, user_id]);
    const handleCreate = () => {
        let flag = 1;
        let email_flag = 1;
        drivers && drivers.forEach(item => {
            if(!item.name || !item.birth_name || !item.birth_date || !item.module95 || !item.birth_place || !item.doctor_type || !item.gender || !item.email || !item.driving_license){
                flag ++
            }
            if(!isValidEmail(item.email)){
              email_flag ++;
            }
            if (!company?.id) {
              item.school_company_id = ""; // Replace "default_value" with the actual default value you want to use
            } else {
              item.school_company_id = company.id;
              item.school_company_name = company.name;
              item.user_id = user_id;
            }
        })
        if(flag > 1 || !company.id){
            return toastr.warning("Bitte einen Wert eingeben"); 
        }
        if(email_flag > 1){
          return toastr.warning("Falsche E-Mail Adresse");
        }
        create.mutate();
    };
    
    const create = useMutation({
        mutationFn: async () => {
        console.log("drivercreate:", drivers);
        let data ;
        for(let i=0;i<drivers.length;i++){
            const res = await api.post("/api/v1/manager/drivers", drivers[i]);
            data = res.data.data;
        }
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["drivers"] }).then((result) => {
          toastr.success("Erfolgreich registriert");
          console.log("driver_register_result:", result)
          navigate("/manager/drivers");
        });
      },
      onError: (err) => {
        console.log("create_database_error:", err);
        toastr.warning("Bitte versuchen Sie es später noch einmal");
      },
    });

    const companies = useQuery<
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
            {drivers.map((driver, index) => (
              <DriversForm
                onChange={(value) => {
                  setDrivers((data) => {
                    const newData = [...data];
                    newData[index] = value;
                    return newData;
                  });
                }}
                value={driver}
                key={index}
              />
            ))}
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
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() => {
              handleCreate();
            }}
          >
            Treiber anlegen
          </button>
        </div>
      </div>
    );
}

export default DriversOneCreatePage;