import Swal from 'sweetalert2';

interface ParsedOption {
    [key: string]: string | number;
}

export const parseOptions = (
    data: Record<string, any>[] = [], 
    selected: (string | number)[] | null = ['', '', 'Select.'],
    index: string[] = [],  
    replace: string[] = ['key', 'value', 'text'] 
): ParsedOption[] => {
    const newData: ParsedOption[] = [];
    try {
        if (selected) {
            const payload: ParsedOption = {};
            for (let rep = 0; rep < replace.length; rep++) {
                payload[replace[rep]] = selected[rep];
            }
            newData.push(payload);
        }
        data.forEach(d => {
            const metaData: ParsedOption = {};
            for (let i = 0; i < index.length; i++) {
                const key = replace[i];
                const value = d[index[i]];
                metaData[key] = value;
            }
            newData.push(metaData);
        });
        return newData;
    } catch (error) {
        return [];
    }
}

export const parseUrl = (path: string = "", replace: string): string => {
    const newPath = path.split('/');
    newPath.splice(-1, 1);
    newPath.push(replace);
    return newPath.join("/");
}

export const backUrl = (path: string = ""): string => {
    const newPath = path.split('/');
    newPath.splice(-1, 1);
    return newPath.join("/");
}

type SwalIcon = 'warning' | 'error' | 'success' | 'info' | 'question';

export const Confirm = async (
    icon: SwalIcon | null = null, 
    text: string | null = null, 
    btn: string | null = null
): Promise<boolean> => {
    const iconValue = icon || 'warning';
    const textValue = text || "¿Deseas guardar los cambios?";
    const btnValue = btn || "Continuar";
    const { value } = await Swal.fire({ 
        icon: iconValue,
        text: textValue,
        confirmButtonText: btnValue,
        showCancelButton: true
    });
    return !!value;
}
