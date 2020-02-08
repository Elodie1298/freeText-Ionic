export let user = {
    id: 1,
    name: 'Boubou'
};

export function rowsToList(rows): Promise<any[]> {
    return new Promise(resolve => {
        let list = [];
        for (let i = 0; i<rows.length; i++) {
            list.push(rows.item(i))
        }
        resolve(list);
    })
}

export function timestampToInteger(timestamp: string): number {
    return new Date(timestamp).getTime();
}

export function integerToTimestamp(timestamp: number): string {
    return new Date(timestamp)
        .toLocaleString('en-GB', {timeZone: 'UTC'})
        .replace(',', '');
}
