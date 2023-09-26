import logo from '/logo.svg';
import { LogoT } from '../../types/types';

const Logo = (props: LogoT) => {
  return <img src={logo} {...props} />;
};

export default Logo;
