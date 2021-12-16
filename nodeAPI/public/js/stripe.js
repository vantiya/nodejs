/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alerts";
const stripe = Stripe(
    "pk_test_51K7GZSSDH1zV1XK3xfJEJmZFbqQA722o553p2RFxlPXHB6BKAPVq3RJxsDeHwLhTv4Ho1aYQou28h662we5vZq7d00PLy1DKvz"
);

export const bookTour = async (tourId) => {
    try {
        // 1) Get checkout session from API
        const session = await axios(
            `/api/v1/bookings/checkout-session/${tourId}`
        );
        // console.log(session);

        // 2) Create checkout form + chanre credit card
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id,
        });
    } catch (err) {
        console.log(err);
        showAlert("error", err);
    }
};
