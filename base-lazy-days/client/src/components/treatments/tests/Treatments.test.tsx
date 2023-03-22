import { screen } from '@testing-library/react';

import { renderWithQueryClient } from '../../../test-utils';
import { Treatments } from '../Treatments';

test('renders response from query', async () => {
  // 클라이언트를 제공하는 provider에 래핑된
  // treatment를 렌더링 할 것
  renderWithQueryClient(<Treatments />);
});
