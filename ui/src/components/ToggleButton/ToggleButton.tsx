import { ToggleButtonGroup, ToggleButton as ToggleButtonComponent } from '@mui/material/';
import { ViewModule, ViewList } from '@mui/icons-material';
import { DataVisualLayout, ToggleButtonProps } from '../../types/types';

const ToggleButton = ({ dataVisualLayout, setDataVisualLayout }: ToggleButtonProps) => {
  const handleChange = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    dataVisualLayout: DataVisualLayout
  ) => {
    if (dataVisualLayout !== null) return setDataVisualLayout(dataVisualLayout);
  };

  return (
    <ToggleButtonGroup
      value={dataVisualLayout}
      onChange={handleChange}
      size="large"
      color="primary"
      exclusive={true}
    >
      <ToggleButtonComponent value="blocks" key="blocks">
        <ViewModule />
      </ToggleButtonComponent>
      <ToggleButtonComponent value="datagrid" key="datagrid">
        <ViewList />
      </ToggleButtonComponent>
    </ToggleButtonGroup>
  );
};

export default ToggleButton;
