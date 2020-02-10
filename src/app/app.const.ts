/**
 * Transform sql rows results on lists
 * @param rows
 */
export function rowsToList(rows): Promise<any[]> {
  return new Promise(resolve => {
    let list = [];
    for (let i = 0; i < rows.length; i++) {
      list.push(rows.item(i));
    }
    resolve(list);
  });
}

/**
 * Get time number from timestamp
 * @param timestamp
 */
export function timestampToInteger(timestamp: any): number {
  return new Date(timestamp).getTime();
}

/**
 * Get timestamp in sql format
 * @param timestamp
 */
export function integerToTimestamp(timestamp: any): string {
  let date = new Date(timestamp);
  return date.getUTCFullYear() + '-' +
    (date.getUTCMonth() + 1) + '-' +
    date.getUTCDate() + ' ' +
    date.toUTCString().split(' ')[4];
}
