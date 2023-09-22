import { Tabs as MuiTabs, Tab, Box, Stack } from '@mui/material';
import { ReactNode, useState } from 'react';
import { spacings, stickyHeight } from '../DesignSystem/DesignSystem';
import { TabsProps } from '../../types/types';

const Tabs = ({ tabNames, children }: TabsProps) => {
  const [value, setValue] = useState(0);

  const onChangeTabs = (_event: any, newValue: number) => {
    setValue(newValue);
  };

  const sticky = stickyHeight('tabs');

  return (
    <Stack spacing={spacings.xlarge} width={'100%'}>
      <MuiTabs
        aria-label={'Tab navigatie'}
        onChange={onChangeTabs}
        value={value}
        textColor={'secondary'}
        indicatorColor={'secondary'}
        scrollButtons
        sx={{
          zIndex: 1,
          background: 'white',
          borderBottom: 1,
          borderColor: 'divider',
          ...sticky,
        }}
      >
        {tabNames?.map((tabName: string, index: number) => (
          <Tab
            key={tabName}
            color={'secondary'}
            id={`tab-${tabName}`}
            aria-controls={`tabpanel-${index}`}
            label={tabName}
          />
        ))}
      </MuiTabs>

      {children.map((child: ReactNode, index: number) => {
        return (
          <Box
            key={index}
            id={`tabpanel-${index}`}
            role={'tabpanel'}
            hidden={value !== index}
            aria-labelledby={`tab-${index}`}
            sx={{ width: '100%' }}
          >
            {value === index && child}
          </Box>
        );
      })}
    </Stack>
  );
};

export default Tabs;
