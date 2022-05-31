import { extendTheme } from '@chakra-ui/react';

// Global style overrides
import styles from './styles';

// // Foundational style overrides
// import borders from './foundations/borders';

// Component style overrides
import Button from './components/button';
import Input from './components/input';
import NumberInput from './components/numberInput';

const overrides = {
  styles,
  // borders,
  // Other foundational style overrides go here
  components: {
    Button,
    Input,
    NumberInput,
    // Other components go here
  },
};

export default extendTheme(overrides);
