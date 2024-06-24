import {createUser, NewUser} from "./schema/users";
import bcrypt from "bcryptjs";
import {Roles} from "./schema/roles";
import {createApartment, NewApartment} from "./schema/apartments";
import {createRoom, NewRoom} from "./schema/rooms";
import {faker} from "@faker-js/faker";
import {createObject, NewObject} from "./schema/objects";
import {createUtilityCounter, NewUtilityCounter, UtilityCounter} from "./schema/utilityCounters";
import {createReading, NewReading} from "./schema/readings";
import {createContract, NewContract} from "./schema/contract";

const password = bcrypt.hashSync("[USER PASSWORD]", 10);

export const seedDatabase = async () => {
    console.log('Seeding database...');
    
    // write your seed here

    console.log('Seeding finished.');
}

seedDatabase().catch((e) => {
    console.error(e)
    process.exit(1);
});