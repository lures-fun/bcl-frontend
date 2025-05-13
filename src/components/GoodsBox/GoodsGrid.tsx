import { SimpleGrid } from '@chakra-ui/react';
import { Goods } from '@/types/Goods';
import { GoodsItem } from './GoodsItem';

type Props = {
  goods: Goods[];
};

export const GoodsGrid = ({ goods }: Props) => {
  return (
    <SimpleGrid
      width={'100%'}
      columnGap={3}
      rowGap={5}
      columns={{ base: 3, md: 5, lg: 7 }}
      py={goods.length > 0 ? 5 : 10}
      px={3}
      bg={'white'}
      color={'black'}
      rounded={'lg'}
    >
      {goods.map((item, index) => (
        <GoodsItem
          key={index}
          id={item ? item.id : null}
          imagePath={item ? item.imagePath : null}
          title={item ? item.title : null}
        />
      ))}
    </SimpleGrid>
  );
};
