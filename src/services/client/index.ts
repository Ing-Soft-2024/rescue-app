import { apiConsumerFactory } from "./api.factory";

const productConsumer = apiConsumerFactory({
    endpoint: '/product',
    validEndpoints: ['GET', 'POST']
});

productConsumer.consume('POST', {
    data: {

    }
});

const sampleDetailsConsumer = apiConsumerFactory({
    endpoint: '/sample/{id}',
    validEndpoints: ['GET']
});



sampleDetailsConsumer.consume('GET')

export const mercadoPagoConsumer = apiConsumerFactory({
    endpoint: '/checkout/mercadopago',
    validEndpoints: ['POST']
});

