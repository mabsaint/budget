
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
    public base = false;
    public paid?: boolean;
    public moment?: any;
    public updated_at?: Date;
    public created_at?: Date;
    constructor(type: string = 'expense') { this.type = type; this.created_at = new Date(); }
}

export interface ICategory {
  title: string;
  subcategories: ICategory[];
}
