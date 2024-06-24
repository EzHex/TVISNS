
interface IContractModel {
    id?: number;

    todayDate: Date;
    ownerFullName: string;
    tenant: string;
    area: number;
    address: string;
    city: string;
    rent: number;
    endDate: Date;
    payRentBeforeDay: number;
    payUtilityBeforeDay: number;

    apartmentId: number;
    tenantId: number;
}

export default IContractModel;