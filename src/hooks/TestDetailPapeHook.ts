import { CheckboxChangeEvent } from "primereact/checkbox";
import { useState } from "react";


export const useCheckBox = () => {
    const [parts, setParts] = useState<boolean[]>([true, ...Array(7).fill(false)]);
    const onPartSelectChange = (event: CheckboxChangeEvent): void => {
        const { value = 0, checked = false } = event;
        let _parts = [...parts];

        if (value === 0) {
            _parts.fill(false, 1);
            _parts[0] = checked;
            setParts(_parts);
            return;
        }
        _parts[value] = checked;

        if (checked) {
            _parts[0] = false;
        } else if (_parts.slice(1).every(part => !part)) {
            _parts[0] = true;
        }


        setParts(_parts);
    };

    return {
        parts,
        onPartSelectChange
    }
}