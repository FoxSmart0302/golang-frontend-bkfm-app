import Panel from "../../../components/Panel.tsx";
import Input from "../../../components/inputs/Input.tsx";
import {ChangeEvent, useEffect, useState} from "react";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import api from "../../../api/api.ts";
import { toastr } from "../../../components/utils/toastr";
import { useNavigate, useParams } from "react-router-dom";
import { isEmpty, isValidEmail, localStorageUserInfo } from "../../../components/utils/index.tsx";

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

const CompanyEditPage = () => {
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
    const handleUpdate = () => {
        if(!form.name || !form.contact_person || !form.email || !form.phone_number || !form.customer_number || !form.street || !form.zip_code || !form.city || !form.note){
            return toastr.warning("Bitte einen Wert eingeben");
        }
        if (!isValidEmail(form.email)) {
          return toastr.warning("Falsche E-Mail Adresse");
        }
        update.mutate();
    }
    const update = useMutation(["update", "companies"], {
      mutationFn: async () => {
        const res = await api.post(`/api/v1/manager/companies/update/${id}`, form);
        const data = res.data.data;
        return data;
      },
      onSuccess: () => {
        queryClient
          .invalidateQueries({ queryKey: ["companies"] })
          .then((result) => {
            toastr.success("Erfolgreich aktualisiert");
            console.log("company_update_result:", result);
            navigate(`/manager/companies`);
          });
      },
      onError: (err) => {
        console.log("create_database_error:", err);
        toastr.warning("Bitte versuchen Sie es später noch einmal");
      },
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        console.log("company_form_data:", form);
        setForm((data) => {
            return {
                ...data,
                [e.target.name]: e.target.value
            }
        });
    };

    

    const handleCancel = () => {
      navigate(`/manager/companies/${id}`);
    };

    return (
      <div className="divide-y divide-gray-900/10">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Unternehmen
            </h1>
          </div>
        </div>
        <div className="drivers-show-subcontainer mt-4 gap-4 grid">
          <div className="grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3 py-4">
            <Panel>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  name="name"
                  label="Name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                />
                <Input
                  name="contact_person"
                  label="Ansprechpartner"
                  type="text"
                  value={form.contact_person}
                  onChange={handleChange}
                />
                <Input
                  name="email"
                  label="Email"
                  type="text"
                  value={form.email}
                  onChange={handleChange}
                />
                <Input
                  name="phone_number"
                  label="Telefon"
                  type="text"
                  value={form.phone_number}
                  onChange={handleChange}
                />
                <Input
                  name="customer_number"
                  label="Kundennummer"
                  type="text"
                  value={form.customer_number}
                  onChange={handleChange}
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
                          onChange={() =>
                            setForm((data) => {
                              return { ...data, self_employed: false };
                            })
                          }
                          className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          checked={!form.self_employed}
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
                          onChange={() =>
                            setForm((data) => {
                              return { ...data, self_employed: true };
                            })
                          }
                          className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          checked={form.self_employed}
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
                    onChange={handleChange}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      name="zip_code"
                      label="Postleitzahl"
                      type="text"
                      value={form.zip_code}
                      onChange={handleChange}
                    />
                    <Input
                      name="city"
                      label="Stadt"
                      type="text"
                      value={form.city}
                      onChange={handleChange}
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
                    onChange={handleChange}
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

export default CompanyEditPage;