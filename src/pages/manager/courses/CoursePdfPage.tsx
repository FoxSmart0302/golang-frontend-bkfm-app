import {useParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import api from "../../../api/api.ts";
import CoursePdf from "./CoursePdf.tsx";
import { formatToGermanTimestamp } from "../../../components/utils/index.tsx";

const CoursePdfPage = () => {
    const {id} = useParams();
    console.log("course_page_pdf_id:", id);
    const course = useQuery<{
        id: string;
        name: string;
        module: {
            id: string;
            name: string;
        }
        location: {
            id: string;
            name: string;
        }
        instructor: {
            id: string;
            name: string;
        },
        extern: boolean;
        max_participants: number;
        start_date: string;
        end_date: string;
        participants: Array<{
            id: string;
            name: string;
        }>
    }>({
        queryKey: ["manager", "courses", id],
        queryFn: async () => {
            const res = await api.get(`/api/v1/manager/courses/${id}`);
            return res.data.data;
        }
    });

    if (!course.isSuccess) return <div>Loading...</div>;

    return <CoursePdf participants={course.data.participants}
                      name={course.data.name}
                      startDate={formatToGermanTimestamp(course.data.start_date)}
                      endDate={formatToGermanTimestamp(course.data.end_date)}
                      module={course.data.module.name}
                      location={course.data.location.name}/>
}


export default CoursePdfPage;
