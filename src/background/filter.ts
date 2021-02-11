// TODO store filters in the storage
class Filters {
    filters: Filter[] = [
        {
            id: 1, title: 'Custom filter 1', enabled: true, description: 'Custom filter description', groupId: 0,
        },
        {
            id: 2, title: 'Custom filter 2', enabled: false, description: 'Custom filter description', groupId: 0,
        },
        {
            id: 3, title: 'Custom filter 3', enabled: false, description: 'Custom filter description', groupId: 0,
        },
        {
            id: 4, title: 'English', enabled: false, description: 'English filter description', groupId: 1,
        },
        {
            id: 5, title: 'Russian', enabled: false, description: 'Russian filter description', groupId: 1,
        },
    ];

    addFilter = (filter: Filter) => {
        this.filters.push(filter);
    };

    removeFilter = (filterId: number): void => {
        this.filters = this.filters.filter((f) => f.id !== filterId);
    };

    getFilters = (): Filter[] => {
        return this.filters;
    };

    updateFilterState = (filterId: number, filterProps: Partial<Filter>): void => {
        const filter = this.filters.find((f) => f.id === filterId);
        if (!filter) {
            throw new Error(`There is filter with id: ${filterId}`);
        }
        const filterIdx = this.filters.indexOf(filter);
        const updatedFilter = { ...filter, ...filterProps };
        this.filters.splice(filterIdx, 1, updatedFilter);
    };

    enableFilter = (filterId: number): void => {
        this.updateFilterState(filterId, { enabled: true });
    };

    disableFilter = (filterId: number): void => {
        this.updateFilterState(filterId, { enabled: false });
    };
}

export const filters = new Filters();
