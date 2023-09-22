import { Menu as MuiMenu, MenuItem } from '@mui/material';
import { MenuProps } from '../../types/types';

const Menu = ({ menuItems, anchorEl, onCloseMenu }: MenuProps) => {
  const openState = Boolean(anchorEl);

  return (
    <MuiMenu
      open={openState}
      anchorEl={anchorEl}
      variant="menu"
      onClose={onCloseMenu}
      MenuListProps={{
        'aria-labelledby': 'Wijzigingen menu',
      }}
      slotProps={{
        paper: {
          variant: 'outlined',
          elevation: 0,
          sx: {
            mt: 1,
          },
        },
      }}
    >
      {menuItems.map(({ label, ...rest }: any) => (
        <MenuItem key={label} {...rest}>
          {label}
        </MenuItem>
      ))}
    </MuiMenu>
  );
};

export default Menu;
