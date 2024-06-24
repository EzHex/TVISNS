import {useEffect, useState} from "react";
import axiosInstance from "../Axios.tsx";
import TenantPayment from "../Payment.tsx";
import {ICounter} from "./utilityReadings/UtilityReadings.tsx";
import UtilityCounter from "../UtilityCounter.tsx";
import {Link} from "react-router-dom";

export interface IPayment {
    id?: number;
    paymentDate: Date;
    paid: boolean;
    paymentAmount: number;
    tenantId: number;
    apartmentId: number;
}

const Tenant = () => {
    const [counters, setCounters] = useState<ICounter[]>([]);

    const [payments, setPayments] = useState<IPayment[]>([]);


    useEffect(() => {
        axiosInstance
            .get(`/tenant`)
            .then((response) => {
                setCounters(response.data.counters);
                setPayments(response.data.payments);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <>
            <div className={"h1 text-center"}>Tenant</div>
            <hr/>
            <div className={"container d-flex justify-content-end mb-1"}>
                <Link
                    to={"/register-failure"}
                    className={"btn btn-dark"}
                >
                    Register failure
                </Link>
            </div>
            <div className="container-fluid">
                <div className="row">
                    <div className="col">
                        <div className={"container border border-2 rounded p-3 border-black mt-1"}>
                            <div className={"h3 text-center"}>Utility readings</div>
                            <hr/>
                            {
                                counters.map((counter: ICounter) => {
                                    return (
                                        <UtilityCounter key={counter.id} {...counter} />
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className="col">
                        <div className={"container border border-2 rounded p-3 border-black mt-1"}>
                            <div className={"h3 text-center"}>Payments</div>
                            <hr />
                            {
                                payments.map((payment: IPayment) => {
                                    return (
                                        <TenantPayment key={payment.id} {...payment} />
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default Tenant;