import Panel from "../../../components/Panel.tsx";
import Input from "../../../components/inputs/Input.tsx";
import {ChangeEvent, useEffect, useState} from "react";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import api from "../../../api/api.ts";
import { toastr } from "../../../components/utils/toastr";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import { isEmpty, isValidEmail, localStorageUserInfo } from "../../../components/utils/index.tsx";
import CompanyImg from "../../../assets/company_example.jpg";


const initialForm = {
    name: "",
    contact_person: "",
    email: "",
    phone_number: "",
    customer_number: "",
    self_employed: false,
    street: "",
    zip_code: "",
    city: "",
    note: "",
}

const CompanyShowPage = () => {
    const {id} = useParams();
    const [form, setForm] = useState(initialForm)
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user_id } = localStorageUserInfo();
    useEffect(() => {
      if (isEmpty(user_id)) {
        window.localStorage.clear();
        return navigate("/login");
      }
    }, [navigate, user_id]);

    useEffect(() => {
      async function fetchData() {
        const res = await api.get(`/api/v1/manager/companies/${id}`);
        const data = await res.data.data;
        console.log("company_show_data:", data)
        setForm(data);
      }
      fetchData();
    }, [id]);
    console.log("company_show_form:", form)

    const handleCancel = () => {
      navigate(`/manager/companies`);
    };

    return (
      <div className="divide-y divide-gray-900/10">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Unternehmen
            </h1>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 flex">
            <button
              type="button"
              onClick={() => navigate(`/manager/companies/edit/${id}`)}
              className="block rounded-md pencil-button px-3 py-2 text-center text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              bearbeiten
            </button>
            <Link
              to={`/manager/companies/create`}  
              className="block rounded-md add-button ml-2 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Neues Unternehmen
            </Link>
            <NavLink
              target="_blank"
              to={`/manager/companies/${id}/pdf`}
              className="block rounded-md print-button px-3 py-2 text-center text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ml-2"
            >
              drucken
            </NavLink>
          </div>
        </div>
        <div className="drivers-show-subcontainer mt-4 gap-4 grid">
          <div className="grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3 py-4">
            <Panel>
              <div className="d-flex totalcompanyshow">
                <div className="">
                  <img src={CompanyImg} alt="" className="w-40" />
                </div>
                <div className="companyheaderbody">
                  <span className="companyheader">{form.name}</span>
                  <span>{form.street}</span>
                  <span>{form.email}</span>
                  <span>{form.phone_number}</span>
                  <span>{form.customer_number}</span>
                </div>
                <div className="companysubheaderbody">
                  <span className="companysubheader">
                    Informationen zum Unternehmen
                  </span>
                  <span>
                    {form.self_employed
                      ? "Selbstständiger Kraftfahrer/in"
                      : "Unternehmen"}
                  </span>
                </div>
              </div>
            </Panel>
          </div>
          <div className="grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3 py-4">
            <Panel>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  name="name"
                  label="Name"
                  type="text"
                  value={form.name}
                  // eslint-disable-next-line @typescript-eslint/no-empty-function
                  onChange={() => {}}
                />
                <Input
                  name="contact_person"
                  label="Ansprechpartner"
                  type="text"
                  value={form.contact_person}
                  // eslint-disable-next-line @typescript-eslint/no-empty-function
                  onChange={() => {}}
                />
                <Input
                  name="email"
                  label="Email"
                  type="text"
                  value={form.email}
                  // eslint-disable-next-line @typescript-eslint/no-empty-function
                  onChange={() => {}}
                />
                <Input
                  name="phone_number"
                  label="Telefon"
                  type="text"
                  value={form.phone_number}
                  // eslint-disable-next-line @typescript-eslint/no-empty-function
                  onChange={() => {}}
                />
                <Input
                  name="customer_number"
                  label="Kundennummer"
                  type="text"
                  value={form.customer_number}
                  // eslint-disable-next-line @typescript-eslint/no-empty-function
                  onChange={() => {}}
                />
                <div>
                  <fieldset className="mt-9">
                    <div className="space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                      <div className="flex items-center">
                        <input
                          id="company"
                          name="self_employed"
                          type="radio"
                          value={!form.self_employed ? "true" : "false"}
                          className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          checked={!form.self_employed}
                          // eslint-disable-next-line @typescript-eslint/no-empty-function
                          onChange={() => {}}
                        />
                        <label
                          htmlFor="company"
                          className="ml-3 block text-sm font-medium leading-6 text-gray-900"
                        >
                          Unternehmen
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="self_employed"
                          name="self_employed"
                          type="radio"
                          value={form.self_employed ? "true" : "false"}
                          className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          checked={form.self_employed}
                          // eslint-disable-next-line @typescript-eslint/no-empty-function
                          onChange={() => {}}
                        />
                        <label
                          htmlFor="self_employed"
                          className="ml-3 block text-sm font-medium leading-6 text-gray-900"
                        >
                          Selbstständiger Kraftfahrer/in
                        </label>
                      </div>
                    </div>
                  </fieldset>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <Input
                    name="street"
                    label="Anschrift"
                    type="text"
                    value={form.street}
                    // eslint-disable-next-line @typescript-eslint/no-empty-function
                    onChange={() => {}}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      name="zip_code"
                      label="Postleitzahl"
                      type="text"
                      value={form.zip_code}
                      // eslint-disable-next-line @typescript-eslint/no-empty-function
                      onChange={() => {}}
                    />
                    <Input
                      name="city"
                      label="Stadt"
                      type="text"
                      value={form.city}
                      // eslint-disable-next-line @typescript-eslint/no-empty-function
                      onChange={() => {}}
                    />
                  </div>
                </div>
                <div className="flex flex-col h-full">
                  <label
                    htmlFor="note"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Notizen
                  </label>
                  <textarea
                    name="note"
                    id="note"
                    className="flex-grow mt-2 w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                    value={form.note}
                    // eslint-disable-next-line @typescript-eslint/no-empty-function
                    onChange={() => {}}
                  />
                </div>
              </div>
            </Panel>
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
        </div>
      </div>
    );
}

export default CompanyShowPage;