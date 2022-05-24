import React from 'react';

import './spinner.less';

const Spinner = (): JSX.Element => (
  <div className="spinner">
    <div className="lds-heart">
      <div />
    </div>
  </div>
);

export default Spinner;
