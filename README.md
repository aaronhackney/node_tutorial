# Node Tuorial

This is my version of the node tutorial found at https://www.raywenderlich.com/61078/write-simple-node-jsmongodb-web-service-ios-app

Note that I changed a few things for modern versions of the libraries.

# Some sample CRUD items:

## (C)reate Operation
curl -H "Content-Type: application/json" -X POST -d '{"title":"Hello World"}' http://localhost:3000/items

## (R)ead Operation
curl http://localhost:3000/items/5a66a40fb88bca25e2f5005c

## (U)pdate Operation
curl -H "Content-Type: application/json" -X PUT -d '{"title":"Good Golly Miss Molly Next!"}' http://localhost:3000/items/5a66a40fb88bca25e2f5005c

## (D)elete Operation
curl -H "Content-Type: application/json" -X DELETE  http://localhost:3000/items/5a66a40fb88bca25e2f5005c


