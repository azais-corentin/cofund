import db from '$lib/db';

export function observeLive<T>(
    collectionName: string,
    array: T[],
    compare: (a: T, b: T) => boolean
) {
    db[collectionName].find().$.subscribe((results: any[]) => {
        results.forEach((doc: any) => {
            const group = doc.toJSON() as T;
            const index = array.findIndex((g) => compare(g, group));
            if (index > -1) {
                array[index] = group;
            } else {
                array.push(group);
            }
        });
    });

    db[collectionName].remove$.subscribe((doc: any) => {
        const group = doc.toJSON() as T;
        const index = array.findIndex((g) => compare(g, group));
        if (index > -1) {
            array.splice(index, 1);
        }
    });
}
