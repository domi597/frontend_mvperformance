const AT_PLATE_STRUCTURE = /^[A-PR-Z0-9]+(?:[-\s][A-PR-Z0-9]+)*$/i;
const AT_PLATE_COMPACT = /^[A-PR-Z]{1,3}[A-PR-Z0-9]{2,7}$/i;

export const isValidAustrianPlate = (val: string): boolean => {
    const trimmed = val.trim();
    if (trimmed === "") return true;
    if (!AT_PLATE_STRUCTURE.test(trimmed)) return false;

    const compact = trimmed.replace(/[-\s]/g, "");
    if (!AT_PLATE_COMPACT.test(compact)) return false;

    return compact.length >= 4 && compact.length <= 8;
};

export const sanitizePlateInput = (raw: string): string => {
    let v = raw.toUpperCase().replace(/[^A-Z0-9\-\s]/g, "");
    v = v.replace(/Q/g, "");
    v = v.replace(/^[^A-Z]+/, "");

    if (!/[-\s]/.test(v)) {
        const digitIndex = v.search(/[0-9]/);
        if (digitIndex > 0) {
            v = `${v.slice(0, digitIndex)}-${v.slice(digitIndex)}`;
        }
    } else {
        v = v.replace(/[-\s]{2,}/g, "-");
    }

    return v.slice(0, 11);
};

export const isValidBuildYear = (val: string): boolean => {
    const trimmed = val.trim();
    if (trimmed === "") return true;
    if (!/^[0-9]{4}$/.test(trimmed)) return false;

    const year = parseInt(trimmed, 10);
    const currentYear = new Date().getFullYear();
    return year >= 1900 && year <= currentYear + 1;
};