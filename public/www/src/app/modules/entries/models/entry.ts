
export class Entry {
    public category: any;
    public subcategory?: string;
    public note?: string;
    public value: number;
    public date?: Date;
    public enddate?: Date;
    public period?: string;
    public _id: string;
    public type: string;
    public base: boolean = false;
    constructor(type: string = 'expense') { this.type = type; }
}

export interface ICategory {
  title: string;
  subcategories: ICategory[];
}
