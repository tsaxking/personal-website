type CBS_TableOptions = {
    classes?: string[];
    id?: string;
    style?: object;
    attributes?: {
        [key: string]: string;
    }
};

class CBS_Table extends CBS_Element {
    constructor(options?: CBS_TableOptions) {
        super(options);
    }
}



CBS.addElement('table', CBS_Table);