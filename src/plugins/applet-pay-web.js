/* global postJson, ready, ApplePaySession */
import merge from 'validator/es/lib/util/merge';

const countryCode = 'CN';
const currencyCode = 'CNY';
const totalLabel = 'Total';
const DEFAULTS = {

}
const shippingMethods = [{
	// label is only used for Apple Pay, not Payment Request
	label: 'Priority Shipping',
	// detail is used for Apple Pay
	// and Payment Request's shipping method's label
	detail: 'USPS Priority Shipping',
	amount: '5.99',
	identifier: 'usps-priority'
}, {
	label: '2 Day Shipping',
	detail: '2 Day Shipping - arrives on ' + new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toLocaleDateString(),
	amount: '8.99',
	identifier: '2-day'
}];

if (window.ApplePaySession) {
	const STATUSES = {
		Failure: ApplePaySession.STATUS_FAILURE,
		InvalidBillingPostalAddress: ApplePaySession.STATUS_INVALID_BILLING_POSTAL_ADDRESS,
		InvalidShippingPostalAddress: ApplePaySession.STATUS_INVALID_SHIPPING_POSTAL_ADDRESS,
		InvalidShippingContact: ApplePaySession.STATUS_INVALID_SHIPPING_CONTACT,
		PINRequired: ApplePaySession.STATUS_PIN_REQUIRED,
		PINIncorrect: ApplePaySession.STATUS_PIN_INCORRECT,
		PINLockout: ApplePaySession.STATUS_PIN_LOCKOUT
	}
}
function mapStatus(status) {
	if (status && STATUSES[status]) {
		return STATUSES[status];
	}
	return ApplePaySession.STATUS_FAILURE;
}

function postJson(url, data) {
	var json = data;
	if (typeof data === 'object') {
		json = JSON.stringify(data);
	} else if (typeof data !== 'string') {
		throw new Error('Data must be an object or a JSON string.');
	}
	return fetch(url, {
		method: 'POST',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		},
		body: json
	}).then(handleResponse);
}

function handleResponse(response) {
	return response.json().then(function(json) {
		if (response.status >= 200 && response.status < 300) {
			// Return success JSON response
			return json;
		}
		// Throw error with response status
		throw new Error(mapStatus(json ? json.status : null));
	});
}

function getProductDetails(productNode) {
	return {
		label: productNode.querySelector('h3').innerHTML,
		amount: productNode.querySelector('.price').
			innerHTML.
			replace('$', '')
	}
}

function createApplePayPaymentRequest(product) {
	return {
		countryCode: countryCode,
		currencyCode: currencyCode,
		supportedNetworks: ['amex', 'visa', 'masterCard', 'discover'],
		merchantCapabilities: ['supports3DS'],
		requiredShippingContactFields: ['postalAddress', 'name', 'phone'],
		requiredBillingContactFields: ['postalAddress', 'name'],
		lineItems: [product],
		total: {
			label: product.label,
			amount: product.amount
		}
	};
}

function applePayPaymentMethodSelected(session, request, event) {
	console.log(event.paymentMethod);
	session.completePaymentMethodSelection(request.total,
		request.lineItems);
}

function selectApplePayShippingMethod(request, shippingMethod) {
	// add shipping method to line items
	var lineItems = request.lineItems.concat({
		label: shippingMethod.label,
		amount: shippingMethod.amount
	});

	// calculate total amount
	var totalAmount = lineItems.reduce(function(total, item) {
		return total += parseFloat(item.amount);
	}, 0);
	// create a new total object with the new amount from
	// the request's original total
	var total = Object.assign({}, request.total, {
		amount: totalAmount.toString()
	});
	// return updated request
	return Object.assign({}, request, {lineItems, total});
}

function applePayShippingContactSelected(session, request, event) {
	console.log(event.shippingContact);
	var updatedRequest = selectApplePayShippingMethod(request,
		shippingMethods[0]);
	session.completeShippingContactSelection(ApplePaySession.STATUS_SUCCESS,
		shippingMethods, updatedRequest.total, updatedRequest.lineItems);

	// return the new request so the session's request can be updated
	return updatedRequest;
}

function applePayShippingMethodSelected(session, request, event) {
	console.log(event.shippingMethod);
	var updatedRequest = selectApplePayShippingMethod(request,
		event.shippingMethod);
	session.completeShippingMethodSelection(ApplePaySession.STATUS_SUCCESS,
		updatedRequest.total, updatedRequest.lineItems);

	// return the new request so the session's request can be updated
	return updatedRequest;
}

function applePayPaymentAuthorized(session, request, event) {
	console.log(event.payment);
	postJson('payment-authorize', {
		payment: event.payment,
		amount: request.total.amount
	}).then(function(response) {
		console.log(response);
		session.completePayment(ApplePaySession.STATUS_SUCCESS);
		// window.location = 'order-confirmation.html';
		alert('支付完成')
	});
}

function cancel(session, event) {
	console.log(event);
}

var ApplePayWeb = {
	defaults:{
		countryCode: 'CN',
		currencyCode: 'CNY',
		validateMerchantURL:null,
		selector:'.apple-pay',
	},
	config: {},
	productDetail:{
		countryCode: 'CN',
		currencyCode: 'CNY',
		supportedNetworks: ['amex', 'visa', 'masterCard', 'discover','chinaUnionPay'],
		merchantCapabilities: ['supports3DS'],
		requiredShippingContactFields: ['postalAddress', 'name', 'phone'],
		requiredBillingContactFields: ['postalAddress', 'name'],
		lineItems: [],//todo
		total: {
			label: 'product.label', //todo
			amount: 'product.amount' //todo
		}
	},
	init(config) {
		this.config = merge(this.defaults,config)
	},
	startApplePay(order,button) {
		// listen to apple pay buttons' click events
		// var applePayButtons = document.querySelectorAll(selector);
		this.productDetail.lineItems = [ {
			label: order.order_sn,
			amount: order.totalamount
		}]
		this.productDetail.total = {
			label: order.order_sn,
			amount: order.totalamount
		}

		button.addEventListener('click',this.handleButtonClick.bind(this));
		// console.log('this.productDetail',this.productDetail)
	},
	handleButtonClick(e) {
		if (!window.ApplePaySession) {
			alert('window.ApplePaySession:'+window.ApplePaySession)
			return;
		}
		e.preventDefault();
		console.log('applepaySession',window.ApplePaySession)
		var request = this.productDetail //createApplePayPaymentRequest(this.productDetail);
		console.log('request',request)
		var session = new ApplePaySession(1, request);
		session.onvalidatemerchant = function(event) {
			this.validateApplePayMerchant(session, event);
		}
		session.onpaymentmethodselected = function(event) {
			applePayPaymentMethodSelected(session, request, event);
		}
		session.onshippingcontactselected = function(event) {
			request = applePayShippingContactSelected(session, request,
				event);
		}
		session.onshippingmethodselected = function(event) {
			request = applePayShippingMethodSelected(session, request,
				event);
		}
		session.onpaymentauthorized = function(event) {
			// Success:
			// {
			// 	"status": 0
			// }
			// Failure:
			// {
			// 	"status": 1,
			// 	"errors": [
			// 	{
			// 		"code": "billingContactInvalid",
			// 		"contactField": "postalAddress",
			// 		"message": "Invalid name"
			// 	},
			// 	{
			// 		"code": "shippingContactInvalid",
			// 		"contactField": "emailAddress",
			// 		"message": "Invalid email"
			// 	}
			// ]
			// }
			applePayPaymentAuthorized(session, request, event);
		}
		session.oncancel = function() {
			cancel(session);
		}
		session.begin();
	},
	removeApplePay(button) {
		// listen to apple pay buttons' click events
		// var applePayButtons = document.querySelectorAll(selector);
		button.removeEventListener('click', this.handleButtonClick);
	},
	validateApplePayMerchant(session, event) {
		postJson(this.config.validateMerchantURL, {
			validationURL: event.validationURL
		}).then(function(response) {
			console.log(JSON.stringify(response));
			session.completeMerchantValidation(response);
		}, function(status) {
			console.log(JSON.stringify(status));
			session.abort();
		});
	},

	/* Payment Request API */
	createPaymentRequest(product) {
		var methodData = [
			{
				supportedMethods: ['visa', 'mastercard', 'amex']
			}, {
				supportedMethods: ['https://android.com/pay'],
				data: {
					environment: 'TEST',
					paymentMethodTokenizationParameters: {
						tokenizationType: 'NETWORK_TOKEN',
						parameters: {
							publicKey: 'BO39Rh43UGXMQy5PAWWe7UGWd2a9YRjNLPEEVe+zWIbdIgALcDcnYCuHbmrrzl7h8FZjl6RCzoi5/cDrqXNRVSo='
						}
					}
				}
			}];
		var details = {
			total: {
				label: totalLabel,
				amount: {
					currency: currencyCode,
					value: product.amount
				}
			},
			displayItems: [
				{
					label: product.label,
					amount: {
						currency: currencyCode,
						value: product.amount
					}
				}]
		};
		var options = {
			requestShipping: true,
			requestPayerEmail: true,
			requestPayerPhone: true
		};
		return {
			methodData: methodData,
			details: details,
			options: options
		};
	},

	selectShippingOption(details, option) {
		var selectedShippingMethod;
		shippingMethods.forEach(function(method) {
			if (method.identifier === option) {
				selectedShippingMethod = method;
			}
		});
		return Object.assign({}, details, {
			shippingOptions: shippingMethods.map(function(method) {
				return {
					id: method.identifier,
					label: method.detail,
					amount: {
						currency: currencyCode,
						value: method.amount
					},
					selected: (method.identifier === option)
				}
			}),
			total: {
				label: totalLabel,
				amount: {
					currency: currencyCode,
					value: (parseFloat(details.total.amount.value) +
						parseFloat(selectedShippingMethod.amount)).toString()
				}
			}
		})
	}

	, shippingAddressChange(request, details, event) {
		console.log(request.shippingAddress);
		// select the first shipping method by default
		event.updateWith(Promise.resolve(
			this.selectShippingOption(details, shippingMethods[0].identifier)));
	}

	, shippingOptionChange(request, details, event) {
		console.log(request.shippingOption);
		event.updateWith(Promise.resolve(
			this.selectShippingOption(details, request.shippingOption)));
	},
	initPaymentRequest(order,button) {
		// listen to buy now buttons' click events
		// var buyNowButtons = document.querySelectorAll('.buy-now');
		// Array.prototype.forEach.call(buyNowButtons, function(button) {
		// });
		button.addEventListener('click', this.buttonClickPaymentRequest.bind(this));
	},
	createPR(order){
		var methodData = [//支付方式选项
			{
				supportedMethods: ['visa', 'mastercard', 'amex']
			},
			{ // google同样支持paymentrequst API：https://developers.google.com/pay/api/web/guides/paymentrequest/tutorial
				supportedMethods: ['https://android.com/pay'],
				data: {
					environment: 'TEST',
					paymentMethodTokenizationParameters: {
						tokenizationType: 'NETWORK_TOKEN',
						parameters: {
							publicKey: 'BO39Rh43UGXMQy5PAWWe7UGWd2a9YRjNLPEEVe+zWIbdIgALcDcnYCuHbmrrzl7h8FZjl6RCzoi5/cDrqXNRVSo='
						}
					}
				}
			}];
		var details = {//订单详情
			total: {
				label: totalLabel,
				amount: {
					currency: currencyCode,
					value: order.totalamount
				}
			},
			displayItems: [
				{
					label: order.order_sn,
					amount: {
						currency: currencyCode,
						value: order.totalamount
					}
				}]
		};
		var options = {//选项参数
			requestShipping: true,
			requestPayerEmail: true,
			requestPayerPhone: true
		};
		return {
			methodData: methodData,
			details: details,
			options: options
		};
	},
	buttonClickPaymentRequest(e){
		e.preventDefault();
		if (!window.PaymentRequest) {
			alert('not in ios')
			return;
		}
		var requestData = this.createPaymentRequest();
		var request = new PaymentRequest(requestData.methodData,
			requestData.details, requestData.options);
		request.addEventListener('shippingaddresschange',
			this.shippingAddressChange.bind(window, request,
				requestData.details));
		request.addEventListener('shippingoptionchange',
			this.shippingOptionChange.bind(window, request,
				requestData.details));
		request.show().then(function(instrument) {
			console.log(instrument);
			instrument.complete().then(function() {
				// window.location = 'order-confirmation.html';
				alert('支付成功')
			})
		}, function(failure) {
			console.error(failure);
			alert('支付失败')
		});
	}
}

export default ApplePayWeb;
