ROTTE POSTMAN

ROTTA GET INDEX
http://localhost:3001/api/prints

ROTTA GET SLUG
http://localhost:3001/api/prints/starry-night-reboot

ROTTA POST CREAZIONE ORDINE
http://localhost:3001/api/orders

body json di test
{
  "full_name": "Mario Rossi",
  "mail": "mario.rossi@example.com",
  "phone_number": "+390611234567",
  "total_price": 120.00,
  "billing_address": "Via Roma 10, 00100 Roma, Italia",
  "shipping_address": "Via Napoli 20, 00184 Roma, Italia",
  "order_status": 1,
  "prints": [
    { "slug": "graffiti-skyline", "quantity_req": 2 },
    { "slug": "dot-cosmos", "quantity_req": 1 }
  ]
}



DELETE ORDER
http://localhost:3001/api/orders/2

//-------query correzione primary key


ALTER TABLE order_print
DROP PRIMARY KEY,
ADD PRIMARY KEY (id_order, id_print);


POST create code body json
{
  "code": "SUMMER29",
  "description": "Sconto estivo del 29%",
  "discount_value": 29,
  "validity": 1,
  "valid_from": "2026-07-20T00:00:00",
  "valid_until": "2026-08-31T23:59:59"
}
