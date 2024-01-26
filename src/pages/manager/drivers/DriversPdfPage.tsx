import { useEffect } from "react";
import {useState} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../../../api/api";
import { localStorageUserInfo, isEmpty } from "../../../components/utils";
import { Driver } from "./DriversForm";
import DriversPdf from "./DriversPdf";


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
  id: string;
};

const initialCompanyForm = {
  name: "",
  id: "",
};

const DriversPdfPage = () => {
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
        const data = res.data.data;
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

    if (!company || !driver) return <div>Loading...</div>;
    console.log("drivers_pdf:", company, driver);
    return (
     <DriversPdf 
        company={company}
        driver={driver}/>
    );
}

export default DriversPdfPage;