interface IApartment {
    id?: number;
    title: string;
    residence: string;
    microDistrict: string;
    street: string;
    houseNumber: string;
    area: number;
    roomNumber: number;
    type: Types;
    floor: number;
    year: string;
    heating: string;
    tenantId?: number;
    ownerId?: number;
}

export enum Types {
    Masonry = 'Masonry',
    Block = 'Block',
    Monolithic = 'Monolithic',
    Wooden = 'Wooden',
    Log = 'Log',
    Framework = 'Framework',
    Other = 'Other'
}

export default IApartment;