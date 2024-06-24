interface IRoom {
    id?: number;
    name: string;
    area: number;
    windowDirection: Direction;
    grade: number;
    ownerId?: number;
    apartmentId?: number;
}

export enum Direction {
    None = "None",
    North = "North",
    South = "South",
    East = "East",
    West = "West",
    NorthEast = "NorthEast",
    NorthWest = "NorthWest",
    SouthEast = "SouthEast",
    SouthWest = "SouthWest"
}

export default IRoom;