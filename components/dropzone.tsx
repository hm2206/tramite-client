import React, { ChangeEvent } from 'react';
import { Form } from 'semantic-ui-react';

interface FileMetadata {
  color: string;
  icon: string;
}

interface FileItem {
  name: string;
  size: number;
}

interface OnChangeParams {
  name: string;
  files: FileList;
}

interface OnDeleteParams {
  e: React.MouseEvent;
  index: number;
  file: FileItem;
}

interface DropZoneProps {
  id: string;
  name: string;
  onChange?: (params: OnChangeParams) => void;
  error?: boolean | string;
  children?: React.ReactNode;
  title?: string;
  accept?: string;
  icon?: string;
  label?: string;
  result?: FileItem[];
  onDelete?: (params: OnDeleteParams) => void;
  disabled?: boolean;
}

const DropZone: React.FC<DropZoneProps> = ({
  id,
  name,
  onChange,
  error = false,
  children = null,
  title = "Select",
  accept = "*",
  icon = 'image',
  label,
  result = [],
  onDelete,
  disabled = false
}) => {

  const metaDatos = (fileName: string): FileMetadata => {
    const items: Record<string, FileMetadata> = {
      pdf: { color: '#d32f2f', icon: 'fas fa-file-pdf' },
      docx: { color: '#1976d2', icon: 'fas fa-file-word' }
    };
    const keyName = `${fileName}`.split('.').pop() || '';
    return items[keyName] || { color: '#37474f', icon: 'fas fa-file-alt' };
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (typeof onChange === 'function' && files) {
      onChange({ name, files });
    }
    const inputElement = document.getElementById(id) as HTMLInputElement;
    if (inputElement) inputElement.value = '';
  };

  return (
    <Form.Field error={!!error}>
      <label htmlFor={id}>{label}</label>
      <label className="dropzone" htmlFor={id} style={{ overflow: 'hidden' }}>
        <div className="text-center dropzone-color pt-3 pb-3" style={{ fontSize: '4em' }}>
          <i className="fas fa-cloud-upload-alt"></i>
          <div style={{ fontSize: '13px', color: '#455a64' }}>
            {title}
          </div>
        </div>
        <input
          type="file"
          id={id}
          accept={accept}
          name={name}
          multiple
          onChange={handleChange}
          hidden
          disabled={disabled}
        />
      </label>
      <label>{typeof error === 'string' ? error : ""}</label>
      <div className="row">
        {result.map((f, indexF) => (
          <div className="col-md-4" key={`${id}-files-${f.name}`}>
            <div className="card">
              <div className="card-body" style={{ overflow: 'hidden' }}>
                <div className="dropzone-text">
                  <i className={metaDatos(f.name).icon} style={{ color: metaDatos(f.name).color }}></i> {f.name}
                </div>
                <span
                  className="dropzone-item-delete"
                  onClick={(e) => typeof onDelete === 'function' ? onDelete({ e, index: indexF, file: f }) : null}
                >
                  <i className="fas fa-times"></i>
                </span>
                <hr />
                <b>{(f.size / (1024 * 1024)).toFixed(2)}MB</b>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Form.Field>
  );
};

export default DropZone;
