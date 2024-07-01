import { Stack, Title, Image, Button, Center, Group } from '@mantine/core';
import React, { useState, useEffect } from 'react';
import comboData from '~/config/comboData.json';
import gimImage from '../config/images/gim.png';
import map2dImage from '../config/images/map2d.png';

type Combo = {
  id: string;
  name: string;
  image: string;
  requestSkeleton: Record<string, any>;
};

type ImageMap = {
  [key: string]: string;
};

const imageMap: ImageMap = {
  'map2d.png': map2dImage,
  'gim.png': gimImage,
};

export const ComboSelection: React.FC<{ onComboSelect: (combo: Combo) => void }> = ({
  onComboSelect,
}) => {
  const [combos, setCombos] = useState<Combo[]>([]);

  useEffect((): void => {
    setCombos(comboData.combos);
  }, []);

  const handleComboSelect = (combo: Combo): void => {
    onComboSelect(combo);
  };

  const getImageSrc = (imageName: string): string => {
    const image = imageMap[imageName];
    if (!image) {
      return '';
    }
    return image;
  };

  return (
    <Stack align="center">
      <Center style={{ width: '100%' }}>
        <Title order={3}>Выбор комбо</Title>
      </Center>
      <Group style={{ width: '100%', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
        {combos.map((combo) => (
          <div key={combo.id} style={{ width: '25%', minWidth: '240px', textAlign: 'center' }}>
            <Title order={4} style={{ marginBottom: '10px' }}>
              {combo.name}
            </Title>
            <Image
              src={getImageSrc(combo.image)}
              alt={combo.name}
              style={{ width: '100%', height: 'auto' }}
            />
            <Button fullWidth onClick={() => handleComboSelect(combo)}>
              ВЫБРАТЬ
            </Button>
          </div>
        ))}
      </Group>
    </Stack>
  );
};

export default ComboSelection;
