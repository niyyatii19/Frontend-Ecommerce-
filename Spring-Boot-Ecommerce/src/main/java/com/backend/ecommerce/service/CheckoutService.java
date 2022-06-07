package com.backend.ecommerce.service;

import com.backend.ecommerce.dto.PaymentInfo;
import com.backend.ecommerce.dto.Purchase;
import com.backend.ecommerce.dto.PurchaseResponse;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;

public interface CheckoutService {
	PurchaseResponse placeOrder(Purchase purchase);
	PaymentIntent createPaymentIntent(PaymentInfo paymentInfo) throws StripeException;
}
