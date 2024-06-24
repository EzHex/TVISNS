
interface IUtilityReading {
    id?: number;
    readingDate: Date;
    electricity: number;
    gas: number;
    coldWater: number;
    hotWater: number;
    tenantId?: number;
    apartmentId?: number;
}

export default IUtilityReading;