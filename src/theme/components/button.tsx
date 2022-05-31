export default {
  baseStyle: {
    fontWeight: 'semibold',
    position: 'static',
  },
  sizes: {
    xl: {
      h: '56px',
      fontSize: 'md',
      px: '32px',
    },
  },
  variants: {
    'with-shadow': {
      bg: '#cf5666',
      color: '#fff',
      boxShadow: '0 0 2px 2px #efdfde',
    },
    // 4. We can override existing variants
    // solid: props => ({
    //   bg: props.colorMode === 'dark' ? 'red.300' : 'red.500',
    // }),
  },
  defaultProps: {
    size: 'sm',
  },
};
