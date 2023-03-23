import { screen } from '@testing-library/react';

import { renderWithQueryClient } from '../../../test-utils';
import { Treatments } from '../Treatments';

test('renders response from query', async () => {
  // 클라이언트를 제공하는 provider에 래핑된
  // treatment를 렌더링 할 것
  renderWithQueryClient(<Treatments />);

  // screen은 렌더링 결과에 접근하는 방법
  // findBy 는 우리가 대기하고 있음을 뜻함
  // 즉, 비동기식!
  // 이 role의 이름을 "heading"이 될것
  const treatmentTitles = await screen.findAllByRole('heading', {
    name: /massage|facial|scrub/i,
  });

  expect(treatmentTitles).toHaveLength(3);
});
