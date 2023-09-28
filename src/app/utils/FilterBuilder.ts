export class FilterBuilder {

    static build(cols: any[], searchString: string) {
        let filterstr = '&filter=';
        let filters: string[] = [];
        cols.forEach((key) => {
            filters.push(key + " ~ '%" + searchString + "%'");
        })
        filterstr += encodeURIComponent(filters.join(' or '));
        return filterstr;
    }
}