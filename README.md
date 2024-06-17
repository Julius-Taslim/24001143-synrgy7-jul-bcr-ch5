# Challenge 5

## How to use?

```
$ npm install
$ npm run dev # run development!
```

## Scripts

```
$ npm run build # build typescript project
$ npm start # run in development mode
```

# API

```
$ List all car -> GET : http://localhost:8000/cars
$ Add car -> POST : http://localhost:8000/cars
$ Delete car by id -> DELETE : http://localhost:8000/cars/:id
$ Update card by id -> PATCH : http://localhost:8000/cars/:id
$ get car data by id -> GET : http://localhost:8000/cars/:id 
```
```
$ Get all user -> GET : http://localhost:8000/users
$ Sign In User -> POST : http://localhost:8000/users/signIn
$ Get User by ID -> GET : http://localhost:8000/users/:id
$ delete User -> DELETE : http://localhost:8000/users/:id
```
```
$ Get all order -> GET : http://localhost:8000/orders
$ Create Order -> POST : http://localhost:8000/orders
$ Delete Order -> DELETE : http://localhost:8000/orders/:id
$ Get Order by Id -> GET : http://localhost:8000/orders/:id

router.get('/', orderService.getOrders);
router.get('/:id', orderService.getOrderById);
router.post('/', orderService.createOrder);
router.delete('/:id', orderService.deleteOrderById);
```

# ERD

```
https://dbdiagram.io/d/ERD-Cars-666924b56bc9d447b17730fb
```

