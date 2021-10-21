import { CategoriesType } from 'Common/constants';

class Categories {
    categories: CategoriesType = [
        {
            groupId: 1,
            groupName: 'Ad Blocking',
            displayNumber: 1,
        },
        {
            groupId: 3,
            groupName: 'Social Widgets',
            displayNumber: 3,
        },
        {
            groupId: 4,
            groupName: 'Annoyances',
            displayNumber: 4,
        },
        {
            groupId: 5,
            groupName: 'Security',
            displayNumber: 5,
        },
        {
            groupId: 7,
            groupName: 'Language-specific',
            displayNumber: 7,
        },
    ];

    getCategories = (): CategoriesType => {
        return this.categories;
    };
}

export const categories = new Categories();
