import ApartmentModel, {Types} from "../../models/apartmentModel.tsx";
import {
    Button,
    Dropdown,
    DropdownButton,
    Form, FormControl,
    Image,
    InputGroup,
    Modal, ModalBody, ModalHeader, ModalTitle,
    Offcanvas,
    OverlayTrigger,
    Tooltip
} from "react-bootstrap";
import {useState} from "react";
import {Link} from "react-router-dom";
import axiosInstance from "../../Axios.tsx";
import copySVG from "../../../assets/copy.svg";
import downloadSVG from "../../../assets/download.svg";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import {ErrorMessage, Formik} from "formik";
import * as yup from "yup";
import {generate} from '@pdfme/generator';
import {Template} from "@pdfme/common";
import template_lt from "../../../assets/contracts/template_lt.json";
import IContractModel from "../../models/contractModel.tsx";

const MySwal = withReactContent(Swal)

const Apartment = (apartment: ApartmentModel) => {
    const apartmentSchema = yup.object().shape({
        title: yup.string().required("Title is required"),
        residence: yup.string().required("Residence is required"),
        microDistrict: yup.string().required("Micro District is required"),
        street: yup.string().required("Street is required"),
        houseNumber: yup.string().required("House number is required"),
        area: yup.number().min(0, "Area is non negative").required("Area is required"),
        roomNumber: yup.number().min(0, "Room count non negative").required("Room Number is required"),
        type: yup.string().required("Type is required"),
        floor: yup.number().required("Floor is required"),
        year: yup.string().required("Year is required"),
        heating: yup.string().required("Heating is required"),
    })

    const contractSchema = yup.object().shape({
        todayDate: yup.date().required("Today date is required"),
        ownerFullName: yup.string().required("Owners full name is required"),
        tenant: yup.string().required("Tenants full name is required"),
        area: yup.number().required("Area is required"),
        address: yup.string().required("Address is required"),
        city: yup.string().required("City is required"),
        rent: yup.number().required("Rent is required"),
        endDate: yup.date().required("End date is required"),
        payRentBeforeDay: yup.number().required("Pay rent before day is required"),
        payUtilityBeforeDay: yup.number().required("Pay utility before day is required"),
    })

    const tenantSchema = yup.object().shape({
        fullName: yup.string().required("Full name is required"),
        email: yup.string().email("Invalid email").required("Email is required"),
    })

    const [show, setShow] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [adText, setAdText] = useState<string>("");
    const [showTenantModal, setShowTenantModal] = useState(false);
    const [language, setLanguage] = useState<string>("lt");

    const [showContractModal, setShowContractModal] = useState(false);
    const [contract, setContract] = useState<IContractModel>();

    const handleContractModalOpen = () => {
        axiosInstance
            .get(`/contract/${apartment.id}`)
            .then((response) => {
                setContract(response.data);
                setShowContractModal(true);
            })
            .catch((error) => {
                console.log(error);
            });
    }
    const handleContractModalClose = () => setShowContractModal(false);


    // const handleModalOpen = async () => {
    //     await getAdText();
    //     setShowModal(true);
    // }

    const handleModalClose = () => {
        setShowModal(false);
        setAdText("");
    }

    const handleTenantModalClose = () => {
        setShowTenantModal(false);
    }

    const handleTenantModalOpen = () => {
        setShowTenantModal(true);
    }

    const handleContract = async () => {


        await axiosInstance
            .get(`/contract/${apartment.id}`)
            .then((response) => {
                const contract: IContractModel = response.data;

                const template: Template = {
                    basePdf: language === "lt" ? template_lt.basePdf : "template_en",
                    schemas: [
                    {
                        "today_year": {
                            "type": "text",
                            "icon": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-text-cursor-input\"><path d=\"M5 4h1a3 3 0 0 1 3 3 3 3 0 0 1 3-3h1\"/><path d=\"M13 20h-1a3 3 0 0 1-3-3 3 3 0 0 1-3 3H5\"/><path d=\"M5 16H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h1\"/><path d=\"M13 8h7a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-7\"/><path d=\"M9 7v10\"/></svg>",
                            "content": "2024\n",
                            "position": {
                                "x": 68.25,
                                "y": 25.12
                            },
                            "width": 15.1,
                            "height": 4.97,
                            "rotate": 0,
                            "alignment": "left",
                            "verticalAlignment": "top",
                            "fontSize": 13,
                            "lineHeight": 1,
                            "characterSpacing": 0,
                            "fontColor": "#000000",
                            "backgroundColor": "",
                            "opacity": 1,
                            "fontName": "Roboto"
                        },
                        "today_month": {
                            "type": "text",
                            "icon": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-text-cursor-input\"><path d=\"M5 4h1a3 3 0 0 1 3 3 3 3 0 0 1 3-3h1\"/><path d=\"M13 20h-1a3 3 0 0 1-3-3 3 3 0 0 1-3 3H5\"/><path d=\"M5 16H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h1\"/><path d=\"M13 8h7a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-7\"/><path d=\"M9 7v10\"/></svg>",
                            "content": "balandžio",
                            "position": {
                                "x": 91.81,
                                "y": 24.88
                            },
                            "width": 30.19,
                            "height": 5.24,
                            "rotate": 0,
                            "alignment": "left",
                            "verticalAlignment": "top",
                            "fontSize": 13,
                            "lineHeight": 1,
                            "characterSpacing": 0,
                            "fontColor": "#000000",
                            "backgroundColor": "",
                            "opacity": 1,
                            "fontName": "Roboto"
                        },
                        "today_day": {
                            "type": "text",
                            "icon": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-text-cursor-input\"><path d=\"M5 4h1a3 3 0 0 1 3 3 3 3 0 0 1 3-3h1\"/><path d=\"M13 20h-1a3 3 0 0 1-3-3 3 3 0 0 1-3 3H5\"/><path d=\"M5 16H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h1\"/><path d=\"M13 8h7a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-7\"/><path d=\"M9 7v10\"/></svg>",
                            "content": "05",
                            "position": {
                                "x": 134.41,
                                "y": 24.87
                            },
                            "width": 10.87,
                            "height": 4.71,
                            "rotate": 0,
                            "alignment": "left",
                            "verticalAlignment": "top",
                            "fontSize": 13,
                            "lineHeight": 1,
                            "characterSpacing": 0,
                            "fontColor": "#000000",
                            "backgroundColor": "",
                            "opacity": 1,
                            "fontName": "Roboto"
                        },
                        "owner_name_surname": {
                            "type": "text",
                            "icon": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-text-cursor-input\"><path d=\"M5 4h1a3 3 0 0 1 3 3 3 3 0 0 1 3-3h1\"/><path d=\"M13 20h-1a3 3 0 0 1-3-3 3 3 0 0 1-3 3H5\"/><path d=\"M5 16H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h1\"/><path d=\"M13 8h7a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-7\"/><path d=\"M9 7v10\"/></svg>",
                            "content": "Owner Surowner",
                            "position": {
                                "x": 56.09,
                                "y": 34.66
                            },
                            "width": 42.62,
                            "height": 5.77,
                            "rotate": 0,
                            "alignment": "left",
                            "verticalAlignment": "top",
                            "fontSize": 13,
                            "lineHeight": 1,
                            "characterSpacing": 0,
                            "fontColor": "#000000",
                            "backgroundColor": "",
                            "opacity": 1,
                            "fontName": "Roboto"
                        },
                        "tenant": {
                            "type": "text",
                            "icon": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-text-cursor-input\"><path d=\"M5 4h1a3 3 0 0 1 3 3 3 3 0 0 1 3-3h1\"/><path d=\"M13 20h-1a3 3 0 0 1-3-3 3 3 0 0 1-3 3H5\"/><path d=\"M5 16H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h1\"/><path d=\"M13 8h7a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-7\"/><path d=\"M9 7v10\"/></svg>",
                            "content": "Tenant Surtenant\n",
                            "position": {
                                "x": 19.58,
                                "y": 39.95
                            },
                            "width": 57.17,
                            "height": 5.5,
                            "rotate": 0,
                            "alignment": "left",
                            "verticalAlignment": "top",
                            "fontSize": 13,
                            "lineHeight": 1,
                            "characterSpacing": 0,
                            "fontColor": "#000000",
                            "backgroundColor": "",
                            "opacity": 1
                        },
                        "area": {
                            "type": "text",
                            "icon": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-text-cursor-input\"><path d=\"M5 4h1a3 3 0 0 1 3 3 3 3 0 0 1 3-3h1\"/><path d=\"M13 20h-1a3 3 0 0 1-3-3 3 3 0 0 1-3 3H5\"/><path d=\"M5 16H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h1\"/><path d=\"M13 8h7a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-7\"/><path d=\"M9 7v10\"/></svg>",
                            "content": "240 kv. m.\n",
                            "position": {
                                "x": 28.05,
                                "y": 63.77
                            },
                            "width": 68.54,
                            "height": 4.97,
                            "rotate": 0,
                            "alignment": "left",
                            "verticalAlignment": "top",
                            "fontSize": 13,
                            "lineHeight": 1,
                            "characterSpacing": 0,
                            "fontColor": "#000000",
                            "backgroundColor": "",
                            "opacity": 1
                        },
                        "street_house_nr": {
                            "type": "text",
                            "icon": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-text-cursor-input\"><path d=\"M5 4h1a3 3 0 0 1 3 3 3 3 0 0 1 3-3h1\"/><path d=\"M13 20h-1a3 3 0 0 1-3-3 3 3 0 0 1-3 3H5\"/><path d=\"M5 16H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h1\"/><path d=\"M13 8h7a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-7\"/><path d=\"M9 7v10\"/></svg>",
                            "content": "Studentų g. 50\n",
                            "position": {
                                "x": 26.46,
                                "y": 68.53
                            },
                            "width": 47.64,
                            "height": 4.97,
                            "rotate": 0,
                            "alignment": "left",
                            "verticalAlignment": "top",
                            "fontSize": 13,
                            "lineHeight": 1,
                            "characterSpacing": 0,
                            "fontColor": "#000000",
                            "backgroundColor": "",
                            "opacity": 1,
                            "fontName": "Roboto"
                        },
                        "city": {
                            "type": "text",
                            "icon": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-text-cursor-input\"><path d=\"M5 4h1a3 3 0 0 1 3 3 3 3 0 0 1 3-3h1\"/><path d=\"M13 20h-1a3 3 0 0 1-3-3 3 3 0 0 1-3 3H5\"/><path d=\"M5 16H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h1\"/><path d=\"M13 8h7a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-7\"/><path d=\"M9 7v10\"/></svg>",
                            "content": "Kaunas\n",
                            "position": {
                                "x": 76.2,
                                "y": 68.79
                            },
                            "width": 27.8,
                            "height": 4.71,
                            "rotate": 0,
                            "alignment": "left",
                            "verticalAlignment": "top",
                            "fontSize": 13,
                            "lineHeight": 1,
                            "characterSpacing": 0,
                            "fontColor": "#000000",
                            "backgroundColor": "",
                            "opacity": 1
                        },
                        "rent1": {
                            "type": "text",
                            "icon": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-text-cursor-input\"><path d=\"M5 4h1a3 3 0 0 1 3 3 3 3 0 0 1 3-3h1\"/><path d=\"M13 20h-1a3 3 0 0 1-3-3 3 3 0 0 1-3 3H5\"/><path d=\"M5 16H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h1\"/><path d=\"M13 8h7a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-7\"/><path d=\"M9 7v10\"/></svg>",
                            "content": "500 eur\n",
                            "position": {
                                "x": 100.28,
                                "y": 78.32
                            },
                            "width": 96.33,
                            "height": 4.44,
                            "rotate": 0,
                            "alignment": "left",
                            "verticalAlignment": "top",
                            "fontSize": 13,
                            "lineHeight": 1,
                            "characterSpacing": 0,
                            "fontColor": "#000000",
                            "backgroundColor": "",
                            "opacity": 1,
                            "fontName": "Roboto"
                        },
                        "end_year": {
                            "type": "text",
                            "icon": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-text-cursor-input\"><path d=\"M5 4h1a3 3 0 0 1 3 3 3 3 0 0 1 3-3h1\"/><path d=\"M13 20h-1a3 3 0 0 1-3-3 3 3 0 0 1-3 3H5\"/><path d=\"M5 16H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h1\"/><path d=\"M13 8h7a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-7\"/><path d=\"M9 7v10\"/></svg>",
                            "content": "2025",
                            "position": {
                                "x": 130.96,
                                "y": 96.83
                            },
                            "width": 15.1,
                            "height": 4.71,
                            "rotate": 0,
                            "alignment": "left",
                            "verticalAlignment": "top",
                            "fontSize": 13,
                            "lineHeight": 1,
                            "characterSpacing": 0,
                            "fontColor": "#000000",
                            "backgroundColor": "",
                            "opacity": 1,
                            "fontName": "Roboto"
                        },
                        "end_month": {
                            "type": "text",
                            "icon": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-text-cursor-input\"><path d=\"M5 4h1a3 3 0 0 1 3 3 3 3 0 0 1 3-3h1\"/><path d=\"M13 20h-1a3 3 0 0 1-3-3 3 3 0 0 1-3 3H5\"/><path d=\"M5 16H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h1\"/><path d=\"M13 8h7a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-7\"/><path d=\"M9 7v10\"/></svg>",
                            "content": "balandžio\n",
                            "position": {
                                "x": 149.75,
                                "y": 96.05
                            },
                            "width": 22.25,
                            "height": 5.24,
                            "rotate": 0,
                            "alignment": "left",
                            "verticalAlignment": "bottom",
                            "fontSize": 10,
                            "lineHeight": 1,
                            "characterSpacing": 0,
                            "fontColor": "#000000",
                            "backgroundColor": "",
                            "opacity": 1,
                            "fontName": "Roboto"
                        },
                        "end_day": {
                            "type": "text",
                            "icon": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-text-cursor-input\"><path d=\"M5 4h1a3 3 0 0 1 3 3 3 3 0 0 1 3-3h1\"/><path d=\"M13 20h-1a3 3 0 0 1-3-3 3 3 0 0 1-3 3H5\"/><path d=\"M5 16H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h1\"/><path d=\"M13 8h7a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-7\"/><path d=\"M9 7v10\"/></svg>",
                            "content": "05\n",
                            "position": {
                                "x": 180.18,
                                "y": 96.84
                            },
                            "width": 10.08,
                            "height": 4.44,
                            "rotate": 0,
                            "alignment": "left",
                            "verticalAlignment": "top",
                            "fontSize": 13,
                            "lineHeight": 1,
                            "characterSpacing": 0,
                            "fontColor": "#000000",
                            "backgroundColor": "",
                            "opacity": 1
                        },
                        "rent2": {
                            "type": "text",
                            "icon": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-text-cursor-input\"><path d=\"M5 4h1a3 3 0 0 1 3 3 3 3 0 0 1 3-3h1\"/><path d=\"M13 20h-1a3 3 0 0 1-3-3 3 3 0 0 1-3 3H5\"/><path d=\"M5 16H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h1\"/><path d=\"M13 8h7a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-7\"/><path d=\"M9 7v10\"/></svg>",
                            "content": "500 eur\n",
                            "position": {
                                "x": 52.87,
                                "y": 115.83
                            },
                            "width": 91.03,
                            "height": 4.44,
                            "rotate": 0,
                            "alignment": "left",
                            "verticalAlignment": "top",
                            "fontSize": 13,
                            "lineHeight": 1,
                            "characterSpacing": 0,
                            "fontColor": "#000000",
                            "backgroundColor": "",
                            "opacity": 1,
                            "fontName": "Roboto"
                        },
                        "pay_rent_before_day": {
                            "type": "text",
                            "icon": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-text-cursor-input\"><path d=\"M5 4h1a3 3 0 0 1 3 3 3 3 0 0 1 3-3h1\"/><path d=\"M13 20h-1a3 3 0 0 1-3-3 3 3 0 0 1-3 3H5\"/><path d=\"M5 16H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h1\"/><path d=\"M13 8h7a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-7\"/><path d=\"M9 7v10\"/></svg>",
                            "content": "25\n",
                            "position": {
                                "x": 152.14,
                                "y": 110.6
                            },
                            "width": 14.31,
                            "height": 4.97,
                            "rotate": 0,
                            "alignment": "left",
                            "verticalAlignment": "top",
                            "fontSize": 13,
                            "lineHeight": 1,
                            "characterSpacing": 0,
                            "fontColor": "#000000",
                            "backgroundColor": "",
                            "opacity": 1,
                            "fontName": "Roboto"
                        },
                        "pay_utility_before_day": {
                            "type": "text",
                            "icon": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-text-cursor-input\"><path d=\"M5 4h1a3 3 0 0 1 3 3 3 3 0 0 1 3-3h1\"/><path d=\"M13 20h-1a3 3 0 0 1-3-3 3 3 0 0 1-3 3H5\"/><path d=\"M5 16H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h1\"/><path d=\"M13 8h7a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-7\"/><path d=\"M9 7v10\"/></svg>",
                            "content": "25\n",
                            "position": {
                                "x": 152.35,
                                "y": 129.33
                            },
                            "width": 14.31,
                            "height": 4.97,
                            "rotate": 0,
                            "alignment": "left",
                            "verticalAlignment": "top",
                            "fontSize": 13,
                            "lineHeight": 1,
                            "characterSpacing": 0,
                            "fontColor": "#000000",
                            "backgroundColor": "",
                            "opacity": 1,
                            "fontName": "Roboto"
                        }
                    },
                    {},
                    {}
                ]
                }

                const inputs = [{
                    today_year: `${contract.todayDate.toString().split('-')[0]}`,
                    today_month: `${contract.todayDate.toString().split('-')[1]}`,
                    today_day: `${contract.todayDate.toString().split('-')[2]}`,
                    owner_name_surname: `${contract.ownerFullName}`,
                    tenant: `${contract.tenant}`,
                    area: `${contract.area} kv. m.`,
                    street_house_nr: `${contract.address}`,
                    city: `${contract.city}`,
                    rent1: `${contract.rent} eur`,
                    end_year: `${contract.endDate.toString().split('-')[0]}`,
                    end_month: `${contract.endDate.toString().split('-')[1]}`,
                    end_day: `${contract.endDate.toString().split('-')[2]}`,
                    rent2: `${contract.rent} eur`,
                    pay_rent_before_day: `${contract.payRentBeforeDay}`,
                    pay_utility_before_day: `${contract.payUtilityBeforeDay}`
                }]

                generate({template, inputs})
                    .then((pdf) => {
                        const blob = new Blob([pdf.buffer], {type: 'application/pdf'});
                        window.open(URL.createObjectURL(blob));
                    })


            })
            .catch((error) => {
                console.log(error);
            });
    }

    const handleDeleteTenant = () => {
        MySwal.fire({
            title: 'Are you sure?',
            text: 'Tenant will be deleted',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            iconColor: '#000000',
            confirmButtonColor: '#000000',
            cancelButtonColor: '#000000',
        })
        .then((result) => {
            if (result.isConfirmed) {
                axiosInstance
                    .delete(`/apartments/${apartment.id}/tenant`)
                    .then(() => {
                        window.location.reload();
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        })
    }

    const handleTenantCreate = (tenant: yup.InferType<typeof tenantSchema>) => {
        axiosInstance
            .post(`/apartments/${apartment.id}/tenant`, tenant)
            .then((response) => {
                handleTenantModalClose();
                MySwal.fire({
                    title: 'Success',
                    html: `<div>Email: ${response.data.email}</div>
                           <div>Password: ${response.data.password}</div>`,
                    icon: 'success',
                    confirmButtonText: 'Ok',
                    iconColor: '#000000',
                    confirmButtonColor: '#000000',
                    cancelButtonColor: '#000000',
                })
                .then(() => {
                    window.location.reload();
                })
            })
            .catch((error) => {
                MySwal.fire({
                    title: 'Error',
                    text: error.response.data.error,
                    icon: 'error',
                    confirmButtonText: 'Ok',
                    iconColor: '#000000',
                    confirmButtonColor: '#000000',
                    cancelButtonColor: '#000000',
                })
            })
    }

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleEdit = async (editApartment: yup.InferType<typeof apartmentSchema>) => {
        axiosInstance
            .put(`/apartments/${apartment.id}`, editApartment)
            .then(() => {
                window.location.reload();
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const handleDelete = async () => {
        axiosInstance
            .delete(`/apartments/${apartment.id}`)
            .then(() => {
                window.location.reload();
            })
            .catch((error) => {
                console.log(error);
            });
    }

    // const getAdText = async () => {
    //     axiosInstance
    //         .get(`/apartments/${apartment.id}/ad`)
    //         .then((response) => {
    //             setAdText(response.data.adText);
    //         })
    //         .catch((error) => {
    //             console.log(error);
    //         });
    // }

    const handleCopyText = () => {
        navigator.clipboard.writeText(adText)
            .catch(err => {
                console.error('Unable to copy text to clipboard:', err);
            });
    };

    const handleDownloadText = () => {
        const blob = new Blob([adText], { type: 'text/plain' });
        const link = document.createElement('a');
        link.download = "ad.txt";
        link.href = window.URL.createObjectURL(blob);
        link.click();
    }

    return (
        <>
            <tr>
                <td className="col-4">{apartment.title}</td>
                <td className="col-5">{`${apartment.street} ${apartment.houseNumber}, ${apartment.microDistrict}`}</td>
                <td className="col-3">
                    <Button className={"m-1"} variant="btn btn-outline-dark" onClick={handleShow}>View</Button>
                    <Link className={"btn btn-outline-dark m-1"} to={`/apartments/${apartment.id}/failures`}>Failures</Link>
                    <Link className={"btn btn-outline-dark m-1"} to={`/apartments/${apartment.id}/utility`}>Utility</Link>
                    <Link className={"btn btn-dark m-1"} to={`/apartments/${apartment.id}/rooms`}>Rooms</Link>
                </td>
            </tr>
            <Offcanvas show={show} onHide={handleClose} backdrop={"static"}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Apartment</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <div className="container pb-5">
                        <Formik
                            validationSchema={apartmentSchema}
                            initialValues={{
                                title: apartment.title,
                                residence: apartment.residence,
                                microDistrict: apartment.microDistrict,
                                street: apartment.street,
                                houseNumber: apartment.houseNumber,
                                area: apartment.area,
                                roomNumber: apartment.roomNumber,
                                type: apartment.type,
                                floor: apartment.floor,
                                year: new Date(apartment.year).toISOString().split('T')[0],
                                heating: apartment.heating,
                            }}
                            onSubmit={(values, {setSubmitting}) => {
                                handleEdit(values)
                                    .finally(() => {
                                        setSubmitting(false);
                                    });
                            }}
                        >
                            {({ handleSubmit, handleChange, values, touched, errors }) => (
                                <Form
                                    noValidate
                                    onSubmit={handleSubmit}
                                    className="mb-3"
                                >
                                    <Form.Floating className={"mb-3"}>
                                        <Form.Control
                                            type="text"
                                            name="title"
                                            value={values.title}
                                            onChange={handleChange}
                                            isInvalid={touched.title && !!errors.title}/>
                                        <Form.Label>Title</Form.Label>
                                        <ErrorMessage
                                            name={"title"}
                                            component={"div"}
                                            className={"text-danger"} />
                                    </Form.Floating>
                                    <Form.Floating className={"mb-3"}>
                                        <Form.Control
                                            type="text"
                                            name="residence"
                                            value={values.residence}
                                            onChange={handleChange}
                                            isInvalid={touched.residence && !!errors.residence}/>
                                        <Form.Label>Residence</Form.Label>
                                        <ErrorMessage
                                            name={"residence"}
                                            component={"div"}
                                            className={"text-danger"} />
                                    </Form.Floating>
                                    <Form.Floating className={"mb-3"}>
                                        <Form.Control
                                            type="text"
                                            name="microDistrict"
                                            value={values.microDistrict}
                                            onChange={handleChange}
                                            isInvalid={touched.microDistrict && !!errors.microDistrict}/>
                                        <Form.Label>Micro District</Form.Label>
                                        <ErrorMessage
                                            name={"microDistrict"}
                                            component={"div"}
                                            className={"text-danger"} />
                                    </Form.Floating>
                                    <Form.Floating className={"mb-3"}>
                                        <Form.Control
                                            type="text"
                                            name="street"
                                            value={values.street}
                                            onChange={handleChange}
                                            isInvalid={touched.street && !!errors.street}/>
                                        <Form.Label>Street</Form.Label>
                                        <ErrorMessage
                                            name={"street"}
                                            component={"div"}
                                            className={"text-danger"} />
                                    </Form.Floating>
                                    <Form.Floating className={"mb-3"}>
                                        <Form.Control
                                            type="text"
                                            name="houseNumber"
                                            value={values.houseNumber}
                                            onChange={handleChange}
                                            isInvalid={touched.houseNumber && !!errors.houseNumber}/>
                                        <Form.Label>House Number</Form.Label>
                                        <ErrorMessage
                                            name={"houseNumber"}
                                            component={"div"}
                                            className={"text-danger"} />
                                    </Form.Floating>
                                    <Form.Floating className={"mb-3"}>
                                        <Form.Control
                                            type="number"
                                            name="area"
                                            value={values.area}
                                            onChange={handleChange}
                                            isInvalid={touched.area && !!errors.area}/>
                                        <Form.Label>Area</Form.Label>
                                        <ErrorMessage
                                            name={"area"}
                                            component={"div"}
                                            className={"text-danger"} />
                                    </Form.Floating>
                                    <Form.Floating className={"mb-3"}>
                                        <Form.Control
                                            type="number"
                                            name="roomNumber"
                                            value={values.roomNumber}
                                            onChange={handleChange}
                                            isInvalid={touched.roomNumber && !!errors.roomNumber}/>
                                        <Form.Label>Room Number</Form.Label>
                                        <ErrorMessage
                                            name={"roomNumber"}
                                            component={"div"}
                                            className={"text-danger"} />
                                    </Form.Floating>
                                    <Form.Floating className={"mb-3"}>
                                        <Form.Select
                                            name="type"
                                            value={values.type}
                                            onChange={handleChange}
                                            isInvalid={touched.type && !!errors.type}>
                                            {
                                                Object.keys(Types).map((type : string) => {
                                                    return <option key={type} value={type}>{type}</option>
                                                })
                                            }
                                        </Form.Select>
                                        <Form.Label>Type</Form.Label>
                                        <ErrorMessage
                                            name={"type"}
                                            component={"div"}
                                            className={"text-danger"} />
                                    </Form.Floating>
                                    <Form.Floating className={"mb-3"}>
                                        <Form.Control
                                            type="number"
                                            name="floor"
                                            value={values.floor}
                                            onChange={handleChange}
                                            isInvalid={touched.floor && !!errors.floor}/>
                                        <Form.Label>Floor</Form.Label>
                                        <ErrorMessage
                                            name={"floor"}
                                            component={"div"}
                                            className={"text-danger"} />
                                    </Form.Floating>
                                    <Form.Floating className={"mb-3"}>
                                        <Form.Control
                                            type="date"
                                            name="year"
                                            value={values.year}
                                            onChange={handleChange}
                                            isInvalid={touched.year && !!errors.year}/>
                                        <Form.Label>Year</Form.Label>
                                        <ErrorMessage
                                            name={"year"}
                                            component={"div"}
                                            className={"text-danger"} />
                                    </Form.Floating>
                                    <Form.Floating className={"mb-3"}>
                                        <Form.Control
                                            type="text"
                                            name="heating"
                                            value={values.heating}
                                            onChange={handleChange}
                                            isInvalid={touched.heating && !!errors.heating}/>
                                        <Form.Label>Heating</Form.Label>
                                        <ErrorMessage
                                            name={"heating"}
                                            component={"div"}
                                            className={"text-danger"} />
                                    </Form.Floating>
                                    {
                                        apartment.tenantId ? <>
                                                <Button
                                                    variant={"btn btn-outline-dark"}
                                                    onClick={handleDeleteTenant}
                                                    className={"w-100 m-1"}
                                                >
                                                    Delete tenant
                                                </Button>
                                                <InputGroup
                                                    className={"m-1"}
                                                >
                                                    <DropdownButton
                                                        variant={"btn btn-outline-dark"}
                                                        title={"Contract"}
                                                        id={"language"}
                                                    >
                                                        <Dropdown.Item
                                                            className={""}
                                                            onClick={ () => setLanguage("lt")}
                                                        >
                                                            lt
                                                        </Dropdown.Item>
                                                        <Dropdown.Item
                                                            className={""}
                                                            onClick={ () => setLanguage("en")}
                                                            disabled
                                                        >
                                                            en
                                                        </Dropdown.Item>
                                                    </DropdownButton>
                                                    <FormControl
                                                        type={"text"}
                                                        value={language}
                                                        readOnly
                                                    ></FormControl>
                                                    <Button
                                                        variant={"btn btn-outline-dark"}
                                                        onClick={handleContractModalOpen}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                    variant={"btn btn-outline-dark"}
                                                    onClick={handleContract}
                                                    >
                                                        Get
                                                    </Button>
                                                </InputGroup>
                                            </> :
                                            <Button
                                                variant={"btn btn-outline-dark"}
                                                onClick={handleTenantModalOpen}
                                                className={"w-100 m-1"}
                                            >
                                                Create tenant
                                            </Button>
                                    }
                                    {/*<Button*/}
                                    {/*    variant={"btn btn-outline-dark"}*/}
                                    {/*    onClick={adText === "" ? handleModalOpen : undefined}*/}
                                    {/*    className={"w-100 m-1"}*/}
                                    {/*>*/}
                                    {/*    {adText === "" ? "Generate ad text" : "Generating..."}*/}
                                    {/*</Button>*/}

                                    <Button
                                        variant={"btn btn-outline-dark"}
                                        type={"submit"}
                                        className={"w-100 m-1"}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant={"btn btn-dark"}
                                        onClick={handleDelete}
                                        className={"w-100 m-1"}
                                    >
                                        Delete
                                    </Button>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>
            <Modal
                backdrop={"static"}
                size="lg"
                show={showModal}
                onHide={handleModalClose}
                aria-labelledby="example-modal-sizes-title-sm">
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-sm">
                        Apartment ad
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className={"d-flex justify-content-between"}>
                    <p>
                        {adText}
                    </p>
                    <div className="d-flex flex-column">
                        <OverlayTrigger
                            overlay={<Tooltip>Copy text</Tooltip>}
                            placement="left">
                            <Button
                                variant={"btn btn-outline-dark"}
                                className={"m-1"}
                                onClick={handleCopyText}>
                                <Image
                                    src={copySVG}
                                    width={20}
                                />
                            </Button>
                        </OverlayTrigger>
                        <OverlayTrigger
                            overlay={<Tooltip>Download text</Tooltip>}
                            placement={"left"}>
                            <Button
                                variant={"btn btn-outline-dark"}
                                className={"m-1"}
                                onClick={handleDownloadText}>
                                <Image
                                    src={downloadSVG}
                                    width={20}
                                />
                            </Button>
                        </OverlayTrigger>
                    </div>
                </Modal.Body>
            </Modal>

            <Modal
                backdrop={"static"}
                size={"lg"}
                show={showTenantModal}
                onHide={handleTenantModalClose}
                aria-labelledby="example-modal-sizes-title-sm">
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-sm">
                        Create tenant account
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Formik
                        validationSchema={tenantSchema}
                        initialValues={{
                            fullName: "",
                            email: ""
                        }}
                        onSubmit={(values, {setSubmitting}) => {
                            handleTenantCreate(values);
                            setSubmitting(false);
                        }}
                    >
                        {({handleSubmit, handleChange, values, touched, errors}) => (
                            <Form
                                noValidate
                                onSubmit={handleSubmit}
                                className={"mb-3"}
                            >
                                <Form.Floating className={"mb-3"}>
                                    <Form.Control
                                        type="text"
                                        name="fullName"
                                        value={values.fullName}
                                        onChange={handleChange}
                                        isInvalid={touched.fullName && !!errors.fullName}/>
                                    <Form.Label>Full name</Form.Label>
                                    <ErrorMessage
                                        name={"fullName"}
                                        component={"div"}
                                        className={"text-danger"} />
                                </Form.Floating>
                                <Form.Floating className={"mb-3"}>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={values.email}
                                        onChange={handleChange}
                                        isInvalid={touched.email && !!errors.email}/>
                                    <Form.Label>Email</Form.Label>
                                    <ErrorMessage
                                        name={"email"}
                                        component={"div"}
                                        className={"text-danger"} />
                                </Form.Floating>
                                <Button
                                    variant={"btn btn-dark"}
                                    type={"submit"}
                                    className={"w-100 m-1"}
                                >
                                    Create
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </Modal.Body>
            </Modal>

            <Modal
                show={showContractModal}
                onHide={handleContractModalClose}
                backdrop={"static"}
                size={"lg"}
            >
                <ModalHeader closeButton>
                    <ModalTitle>Contract</ModalTitle>
                </ModalHeader>
                <ModalBody>
                    <Formik
                        validationSchema={contractSchema}
                        initialValues={contract!}
                        onSubmit={(values, {setSubmitting}) => {
                            axiosInstance
                                .post(`/contract/${apartment.id}`, values)
                                .then(() => {
                                    handleContractModalClose();
                                })
                                .catch((error) => {
                                    console.log(error);
                                })
                            setSubmitting(false);
                        }}
                    >
                        {({handleSubmit, handleChange, values, touched, errors}) => (
                            <Form
                                noValidate
                                onSubmit={handleSubmit}
                                className={"mb-3"}
                            >
                                <Form.Floating className={"mb-3"}>
                                    <Form.Control
                                        type="date"
                                        name="todayDate"
                                        // @ts-expect-error date error
                                        value={values.todayDate}
                                        onChange={handleChange}
                                        isInvalid={touched.todayDate && !!errors.todayDate}/>
                                    <Form.Label>Today date</Form.Label>
                                    <ErrorMessage
                                        name={"todayDate"}
                                        component={"div"}
                                        className={"text-danger"} />
                                </Form.Floating>
                                <Form.Floating className={"mb-3"}>
                                    <Form.Control
                                        type="text"
                                        name="ownerFullName"
                                        value={values.ownerFullName}
                                        onChange={handleChange}
                                        isInvalid={touched.ownerFullName && !!errors.ownerFullName}/>
                                    <Form.Label>Owner full name</Form.Label>
                                    <ErrorMessage
                                        name={"ownerFullName"}
                                        component={"div"}
                                        className={"text-danger"} />
                                </Form.Floating>
                                <Form.Floating className={"mb-3"}>
                                    <Form.Control
                                        type="text"
                                        name="tenant"
                                        value={values.tenant}
                                        onChange={handleChange}
                                        isInvalid={touched.tenant && !!errors.tenant}/>
                                    <Form.Label>Tenant</Form.Label>
                                    <ErrorMessage
                                        name={"tenant"}
                                        component={"div"}
                                        className={"text-danger"} />
                                </Form.Floating>
                                <Form.Floating className={"mb-3"}>
                                    <Form.Control
                                        type="text"
                                        name="area"
                                        value={values.area}
                                        onChange={handleChange}
                                        isInvalid={touched.area && !!errors.area}/>
                                    <Form.Label>Area</Form.Label>
                                    <ErrorMessage
                                        name={"area"}
                                        component={"div"}
                                        className={"text-danger"} />
                                </Form.Floating>
                                <Form.Floating className={"mb-3"}>
                                    <Form.Control
                                        type="text"
                                        name="address"
                                        value={values.address}
                                        onChange={handleChange}
                                        isInvalid={touched.address && !!errors.address}/>
                                    <Form.Label>Address</Form.Label>
                                    <ErrorMessage
                                        name={"address"}
                                        component={"div"}
                                        className={"text-danger"} />
                                </Form.Floating>
                                <Form.Floating className={"mb-3"}>
                                    <Form.Control
                                        type="text"
                                        name="city"
                                        value={values.city}
                                        onChange={handleChange}
                                        isInvalid={touched.city && !!errors.city}/>
                                    <Form.Label>City</Form.Label>
                                    <ErrorMessage
                                        name={"city"}
                                        component={"div"}
                                        className={"text-danger"} />
                                </Form.Floating>
                                <Form.Floating className={"mb-3"}>
                                    <Form.Control
                                        type="text"
                                        name="rent"
                                        value={values.rent}
                                        onChange={handleChange}
                                        isInvalid={touched.rent && !!errors.rent}/>
                                    <Form.Label>Rent</Form.Label>
                                    <ErrorMessage
                                        name={"rent"}
                                        component={"div"}
                                        className={"text-danger"} />
                                </Form.Floating>
                                <Form.Floating className={"mb-3"}>
                                    <Form.Control
                                        type="date"
                                        name="endDate"
                                        // @ts-expect-error date error
                                        value={values.endDate}
                                        onChange={handleChange}
                                        isInvalid={touched.endDate && !!errors.endDate}/>
                                    <Form.Label>End date</Form.Label>
                                    <ErrorMessage
                                        name={"endDate"}
                                        component={"div"}
                                        className={"text-danger"} />
                                </Form.Floating>
                                <Form.Floating className={"mb-3"}>
                                    <Form.Control
                                        type="number"
                                        name="payRentBeforeDay"
                                        value={values.payRentBeforeDay}
                                        onChange={handleChange}
                                        isInvalid={touched.payRentBeforeDay && !!errors.payRentBeforeDay}/>
                                    <Form.Label>Pay rent before day</Form.Label>
                                    <ErrorMessage
                                        name={"payRentBeforeDay"}
                                        component={"div"}
                                        className={"text-danger"} />
                                </Form.Floating>
                                <Form.Floating className={"mb-3"}>
                                    <Form.Control
                                        type="number"
                                        name="payUtilityBeforeDay"
                                        value={values.payUtilityBeforeDay}
                                        onChange={handleChange}
                                        isInvalid={touched.payUtilityBeforeDay && !!errors.payUtilityBeforeDay}/>
                                    <Form.Label>Pay utility before day</Form.Label>
                                    <ErrorMessage
                                        name={"payUtilityBeforeDay"}
                                        component={"div"}
                                        className={"text-danger"} />
                                </Form.Floating>
                                <Button
                                    variant={"btn btn-dark"}
                                    type={"submit"}
                                    className={"w-100 m-1"}
                                >
                                    Update
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </ModalBody>
            </Modal>
        </>
)
}

export default Apartment;