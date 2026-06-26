/** Austrian license plate: e.g. W-12345AB, GZ-123A, L-5678BC */
const AT_PLATE = /^[A-ZÜÖÄ]{1,3}[-\s]?[0-9]{1,5}[A-ZÜÖÄ]{1,2}$/i;

export const isValidAustrianPlate = (val: string): boolean =>
    val.trim() === "" || AT_PLATE.test(val.trim());
