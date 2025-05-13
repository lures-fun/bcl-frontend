import { Flex, Image, Text } from '@chakra-ui/react';
import previewImage from '../../assets/preview.png';
import { pathsCreator } from '@/utils/constValues';
import { useRouter } from 'next/navigation';
type Props = {
  id: string | null;
  imagePath: string | null;
  title: string | null;
};

export const GoodsItem = ({ id, imagePath, title }: Props) => {
  const router = useRouter();
  return (
    <Flex
      gap={2}
      alignItems={'center'}
      flexDirection={'column'}
      onClick={() => id && router.push(pathsCreator.goodsDetail(id))}
    >
      <Image
        src={imagePath ? imagePath : previewImage.src}
        objectFit={'cover'}
        width={{ base: '80px', sm: '100px', md: '120px', lg: '150px' }}
        height={{ base: '80px', sm: '100px', md: '120px', lg: '150px' }}
        rounded={'lg'}
      />
      <Text fontSize={'xs'}>{title ? title : ''}</Text>
    </Flex>
  );
};
