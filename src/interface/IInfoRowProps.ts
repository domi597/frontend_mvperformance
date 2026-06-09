
export interface IInfoRowProps {
    icon: React.ReactNode;
    label: string;
    value: string | null | undefined;
    onEdit?: () => void;
}
