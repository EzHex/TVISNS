import express, {Router} from 'express';
import {
    AccessToken,
    Login,
    Register
} from '../controllers/auth';
import {
    BlockUser,
    CreateTenant, DeleteTenant,
    GetAllUsers,
    UnblockUser
} from '../controllers/users';
import bodyParser from "body-parser";
import {Roles} from "../db/schema/roles";
import {Authorize} from "../auth/JwtAuth";
import {
    CreateApartment,
    DeleteApartment,
    GenerateAdText,
    GetAllApartments,
    UpdateApartment
} from "../controllers/apartments";
import {
    CreateRoom,
    DeleteRoom,
    GetAllRooms,
    UpdateRoom} from "../controllers/rooms";
import {
    CreateFailure,
    CreateObject,
    DeleteObject, GetAllApartmentFailures,
    GetAllObjects, GetAllTenantObjects, GetAllTenantRooms, GetObject, GetObjectImage, GetTenantFailures, UpdateFailure,
    UpdateObject
} from "../controllers/objects";
import {
        GetTenantData
} from "../controllers/tenant";
import {
    CreatePayment,
    HandleStripePayment
} from "../controllers/apartmentPayments";
import {GetContract, UpdateContract} from "../controllers/contract";
import {
    CreateCounter,
    CreateReading,
    DeleteCounter,
    DeleteReading,
    GetCounters,
    GetReadings
} from "../controllers/utilityCounters";

const router : Router = express.Router();
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

router.post('/auth/register', Register);
router.post('/auth/login', Login);
router.get('/auth/access-token', AccessToken);

//Admin
router.get('/users', Authorize([Roles.Admin]), GetAllUsers);
router.put('/users/:id/block', Authorize([Roles.Admin]), BlockUser);
router.put('/users/:id/unblock', Authorize([Roles.Admin]), UnblockUser);

// Owner
// Apartments
router.get('/apartments', Authorize([Roles.Owner]), GetAllApartments);
router.post('/apartments', Authorize([Roles.Owner]), CreateApartment);
router.put('/apartments/:id', Authorize([Roles.Owner]), UpdateApartment);
router.delete('/apartments/:id', Authorize([Roles.Owner]), DeleteApartment);
router.get('/apartments/:apartmentId/ad', Authorize([Roles.Owner]), GenerateAdText);
router.post('/apartments/:apartmentId/tenant', Authorize([Roles.Owner]), CreateTenant);
router.delete('/apartments/:apartmentId/tenant', Authorize([Roles.Owner]), DeleteTenant);
router.get("/apartments/:apartmentId/failures", Authorize([Roles.Owner]), GetAllApartmentFailures);
router.put("/apartments/:apartmentId/failures/:id", Authorize([Roles.Owner]), UpdateFailure);
//Rooms
router.get('/apartments/:apartmentId/rooms', Authorize([Roles.Owner]), GetAllRooms);
router.post('/apartments/:apartmentId/rooms', Authorize([Roles.Owner]), CreateRoom);
router.put('/apartments/:apartmentId/rooms/:id', Authorize([Roles.Owner]), UpdateRoom);
router.delete('/apartments/:apartmentId/rooms/:id', Authorize([Roles.Owner]), DeleteRoom);
//Objects
router.get('/apartments/:apartmentId/rooms/:roomId/objects', Authorize([Roles.Owner]), GetAllObjects);
router.get('/apartments/:apartmentId/rooms/:roomId/objects/:id', Authorize([Roles.Owner]), GetObjectImage);
router.post('/apartments/:apartmentId/rooms/:roomId/objects', Authorize([Roles.Owner]), CreateObject);
router.put('/apartments/:apartmentId/rooms/:roomId/objects/:id', Authorize([Roles.Owner]), UpdateObject);
router.delete('/apartments/:apartmentId/rooms/:roomId/objects/:id', Authorize([Roles.Owner]), DeleteObject);
router.get("/objects/:objectId", Authorize([Roles.Owner]), GetObject);
//Utility
router.get('/utility/counters/:apartmentId', Authorize([Roles.Owner]), GetCounters);
router.post('/utility/counters/:apartmentId', Authorize([Roles.Owner]), CreateCounter);
router.delete('/utility/counters/:counterId', Authorize([Roles.Owner]), DeleteCounter);
router.delete('/utility/counters/:counterId/readings/:id', Authorize([Roles.Owner]), DeleteReading);
//Payments
router.post('/apartments/:apartmentId/utilityReadings/:id/payments', Authorize([Roles.Owner]), CreatePayment);
//Contracts
router.post('/contract/:apartmentId', Authorize([Roles.Owner]), UpdateContract);

//Tenant
router.get('/tenant', Authorize([Roles.Tenant]), GetTenantData);
router.post('/tenant/pay', Authorize([Roles.Tenant]), HandleStripePayment);
router.get('/tenant/rooms', Authorize([Roles.Tenant]), GetAllTenantRooms);
router.get('/tenant/rooms/:roomId/objects', Authorize([Roles.Tenant]), GetAllTenantObjects);
router.post('/tenant/failures', Authorize([Roles.Tenant]), CreateFailure);
router.get('/tenant/failures', Authorize([Roles.Tenant]), GetTenantFailures);

//Both
router.get('/contract/:apartmentId', Authorize([Roles.Tenant, Roles.Owner]), GetContract);
router.get('/utility/counters/:counterId/readings', Authorize([Roles.Owner, Roles.Tenant]), GetReadings);
router.post('/utility/counters/:counterId/readings', Authorize([Roles.Owner, Roles.Tenant]), CreateReading);

export default router;