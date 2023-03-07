import { Icon, Stack, Text } from '@chakra-ui/react';
import { ReactElement } from 'react';
import { GiFlowerPot } from 'react-icons/gi';

import { BackgroundImage } from '../common/BackgroundImage';
import { usePrefetchTreatments } from '../treatments/hooks/useTreatments';

export function Home(): ReactElement {
  // prefetch를 위해 만든 커스텀 훅 usePrefetchTreatments 를
  // 최상위 레벨에서 실행한다.
  usePrefetchTreatments();
  // 최초 마운트 시에만 실행되도록 useEffect 콜백 내에서
  // 사용할수는 없을까!? 라는 생각을 했음.
  //  ->
  // useEffect 콜백 내에서 훅을 실행할 수 없음
  return (
    <Stack textAlign="center" justify="center" height="84vh">
      <BackgroundImage />
      <Text textAlign="center" fontFamily="Forum, sans-serif" fontSize="6em">
        <Icon m={4} verticalAlign="top" as={GiFlowerPot} />
        Lazy Days Spa
      </Text>
      <Text>Hours: limited</Text>
      <Text>Address: nearby</Text>
    </Stack>
  );
}
