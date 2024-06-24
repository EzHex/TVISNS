
interface IObject {
    id?: number;
    title: string;
    description: string;
    image: string;
    grade: number;
    ownerId?: number;
    roomId?: number;
}

export default IObject;