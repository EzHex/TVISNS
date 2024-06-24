import {IPayment} from "./pages/Tenant.tsx";
import {Button} from "react-bootstrap";
import {loadStripe} from "@stripe/stripe-js";
import {STRIPE_PUBLIC_KEY} from "../config.tsx";
import axiosInstance from "./Axios.tsx";

const TenantPayment = (payment : IPayment) => {
    const handlePayment = async () => {
        const stripe = await loadStripe(STRIPE_PUBLIC_KEY);

        axiosInstance
            .post("/tenant/pay", payment)
            .then((response) => {
                stripe!.redirectToCheckout({
                    sessionId: response.data.id
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const containerClassName = !payment.paid
        ? "container border rounded m-1 p-3 justify-content-between d-flex space-between"
        : "container border rounded m-1 p-3 justify-content-between d-flex space-between bg-dark text-white";

    return (
        <div className={containerClassName}>
            <div>
                {/*@ts-expect-error ts date format*/}
                <div>Payment created: {payment.paymentDate}</div>
                <div>Payment amount: {payment.paymentAmount} Eur.</div>
            </div>
            {
                !payment.paid
                    ? <Button
                        variant={"btn btn-outline-dark"}
                        onClick={handlePayment}
                    >
                        Pay
                    </Button>
                    : <div>Paid</div>
            }
        </div>
    )
}

export default TenantPayment;